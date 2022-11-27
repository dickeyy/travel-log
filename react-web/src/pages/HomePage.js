import { ChakraProvider, Text, Heading, Box, Button, Spinner, Toast, useToast } from "@chakra-ui/react"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import React from 'react';
import theme from "../theme";
import { NavLink } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios';

function HomePage() {

  const [markers, setMarkers] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  const [pageLoading, setPageLoading] = React.useState(true);
  const toast = useToast()

  const cookies = new Cookies();
  const [session] = React.useState(cookies.get('travel-session'));

  React.useEffect(() => {
    console.log(session);
    if (session !== undefined) {
        console.log('User is logged in')
    } else {
        window.location.href = '/signin';
    }

    axios.get(`https://4e3xnppei9.execute-api.us-east-1.amazonaws.com/user/${session}`).then((response) => {
      setMarkers(response.data.user.places); 

      setTimeout(() => {
        let countryTemp = [];
        let stateTemp = [];
        let cityTemp = [];
        response.data.user.places.forEach((place) => {
          

          countryTemp.push(place.country);
          stateTemp.push(place.state);
          cityTemp.push(place.city);

          // remove duplicates

          countryTemp = [...new Set(countryTemp)];
          stateTemp = [...new Set(stateTemp)];
          cityTemp = [...new Set(cityTemp)];

          setCountries(countryTemp);
          setStates(stateTemp);
          setCities(cityTemp);

        })
      }, 1000);
      
      setPageLoading(false);
    }).catch((error) => {
      console.log(error);
    })
  }, [session]);

  const center = {
    lat: 38.505,
    lng: -101.936,
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDgz8EHPi5gc1iwCty818eOvmJf0QX7GZ4"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.setZoom(5);
    map.fitBounds(bounds);

    setMap(map)
  }, [center])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (

    <ChakraProvider theme={theme}>

      {pageLoading ? (
        <Box justifyContent={'center'} alignItems={'center'}>
          <Spinner />
        </Box>
      ) : (
      
      <>
        <GoogleMap
          mapContainerStyle={{
            height: '100vh',
            width: '100%'
          }}
          options={{
            minZoom: 2,
            maxZoom: 10,
            mapId: '8acd5a9da19a6d58',
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            zoomControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_CENTER
            },
          }}
          zoom={4}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => {

            new window.google.maps.Geocoder().geocode({ 'location': { lat: e.latLng.lat(), lng: e.latLng.lng() } }, (results, status) => {
              if (status === 'OK') {
                if (results[0]) {
                  let country = results[0].address_components.find((component) => component.types.includes('country'));
                  let state = results[0].address_components.find((component) => component.types.includes('administrative_area_level_1'));
                  let city = results[0].address_components.find((component) => component.types.includes('locality'));

                  if (!country) {
                    alert('Selected location could not be geo-coded. Please remove the marker and select a location closer to a city.\n\nLatitude: ' + e.latLng.lat() + '\nLongitude: ' + e.latLng.lng());
                    toast({
                      title: "Error",
                      description: 'Selected location could not be geo-coded. Please remove the marker and select a location closer to a city..\n\nLatitude: ' + e.latLng.lat() + '\nLongitude: ' + e.latLng.lng(),
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    })
                    return;
                  }

                  if (country) {
                    country = country.long_name;
                    setCountries((countries) => {
                      if (!countries.includes(country)) {
                        return [...countries, country];
                      }
                      return countries;
                    });
                  }
                  if (state && country === 'United States') {
                    state = state.long_name;
                    setStates((states) => {
                      if (!states.includes(state)) {
                        return [...states, state];
                      }
                      return states;
                    });
                  }
                  if (city) {
                    city = city.long_name;
                    setCities((cities) => {
                      if (!cities.includes(city)) {
                        return [...cities, city];
                      }
                      return cities;
                    });
                  }

                  // post to api
                  axios.post(`https://4e3xnppei9.execute-api.us-east-1.amazonaws.com/user/${session.uid}/add-place`, {
                    place: {
                      position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                      title: 'Visited Location',
                      country: country,
                      state: state,
                      city: city
                    }
                  }).then((response) => {
                    console.log(response);
                  }).catch((error) => {
                    console.log(error);
                  });

                  const marker = new window.google.maps.Marker({
                    position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                    map: map,
                    title: 'Visited Location',
                    country: country,
                    state: state,
                    city: city
                  });

                  setMarkers((markers) => [...markers, marker]);
                
                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });
          }}
        >

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.position.lat, lng: marker.position.lng }}
              title={marker.title}
              map={map}
              onClick={() => {
                // Remove the marker
                marker.setMap(null);

                // Remove from markers array
                setMarkers((markers) => {
                  return markers.filter((m) => m !== marker);
                });
              }}
            />
          ))}
          
        </GoogleMap>

        <Box 
          m={3} p={3} 
          w={'fit-content'} 
          backgroundColor={'rgba(180, 180, 180, 0.2)'}
          backdropFilter={'blur(10px)'}
          boxShadow={'rgba(28, 28, 28, 0.2) 0px 0px 10px'}
          borderRadius={12} 
          pos={'absolute'} 
          zIndex={0} 
          top={0}
        >
          <Heading fontSize={'xl'} fontWeight={'extrabold'}>You Have Visited:</Heading>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Text>{markers.length} Places</Text>
            <Box w={5} />
            <Text>{countries.length} Countries</Text>
            <Box w={5} />
            <Text>{states.length} States</Text>
            <Box w={5} />
            <Text>{cities.length} Cities</Text>
            <Box w={5} />
            <NavLink to={'/signout'}>
              <Button colorScheme={'red'} size={'sm'}>
                Sign Out
              </Button>
            </NavLink>
          </Box>
        </Box>
      </>
    )}
    </ChakraProvider>
  ) : <></>
}

export default HomePage;
