import { api } from '../config';
import { find, compact, isEmpty } from 'lodash';
import { mapboxClient } from '../components/MapboxClient';
import { reverseGeocode } from '../utils/helpers';
import * as Types from '../utils/actionTypes';

export function updateSearchQuery(query) {
  return {
    type: Types.SEARCH_QUERY_UPDATED,
    payload: { ...query }
  };
}

export function updateLocation(propertyPath, value) {
  return {
    type: Types.LOCATION_UPDATED,
    propertyPath,
    value
  };
}

export function fetchVAFacility(id, facility = null) {
  if (facility) {
    return {
      type: Types.FETCH_VA_FACILITY,
      payload: facility,
    };
  }

  const url = `${api.url}/${id}`;

  return (dispatch) => {
    dispatch({
      type: Types.SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        data => dispatch({ type: Types.FETCH_VA_FACILITY, payload: data.data }),
        err => dispatch({ type: Types.SEARCH_FAILED, err })
      );
  };
}

export function searchWithBounds(bounds, facilityType, serviceType, page = 1) {
  const params = compact([
    ...bounds.map(c => `bbox[]=${c}`),
    facilityType ? `type=${facilityType}` : null,
    facilityType === 'benefits' && serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  return (dispatch) => {
    dispatch({
      type: Types.SEARCH_STARTED,
      payload: {
        page,
        searchBoundsInProgress: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        (data) => {
          if (data.errors) {
            dispatch({ type: Types.SEARCH_FAILED, err: data.errors });
          } else {
            dispatch({ type: Types.FETCH_VA_FACILITIES, payload: data });
          }
        },
        (err) => dispatch({ type: Types.SEARCH_FAILED, err })
      );
  };
}

export function genBBoxFromAddress(query) {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!query.searchString) {
    return { type: Types.SEARCH_FAILED };
  }

  return (dispatch) => {
    dispatch({
      type: Types.SEARCH_STARTED,
    });
    // commas can be stripped from query if Mapbox is returning unexpected results
    let types = 'place,address,region,postcode,locality';
    // check for postcode search
    if (query.searchString.match(/^\s*\d{5}\s*$/)) {
      types = 'postcode';
    }
    mapboxClient.geocodeForward(query.searchString, {
      country: 'us,pr,ph,gu,as,mp',
      types,
    }, (err, res) => {
      if (!err && !isEmpty(res.features)) {
        const coordinates = res.features[0].center;
        const zipCode = (find(res.features[0].context, (v) => {
          return v.id.includes('postcode');
        }) || {}).text || res.features[0].place_name;
        const featureBox = res.features[0].box;

        let minBounds = [
          coordinates[0] - 0.75,
          coordinates[1] - 0.75,
          coordinates[0] + 0.75,
          coordinates[1] + 0.75,
        ];

        if (featureBox) {
          minBounds = [
            Math.min(featureBox[0], coordinates[0] - 0.75),
            Math.min(featureBox[1], coordinates[1] - 0.75),
            Math.max(featureBox[2], coordinates[0] + 0.75),
            Math.max(featureBox[3], coordinates[1] + 0.75),
          ];
        }
        return dispatch({
          type: Types.SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            context: zipCode,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
            bounds: minBounds,
            zoomLevel: res.features[0].id.split('.')[0] === 'region' ? 7 : 9,
          }
        });
      }

      return dispatch({
        type: Types.SEARCH_FAILED,
        err,
      });
    });
  };
}

export const searchProviders = (bounds, serviceType, page = 1) => {
  const address = reverseGeocode(bounds);
  const params = compact([
    `address=${address}`,
    serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  return (dispatch) => {
    dispatch({
      type: Types.SEARCH_STARTED,
      payload: {
        page,
        searchBoundsInProgress: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: Types.FETCH_CC_PROVIDERS, payload: data });
      }, error => {
        dispatch({ type: Types.SEARCH_FAILED, error });
      });
  };
};
