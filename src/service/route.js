import { fetchRoute } from ".";
export async function load3routes(driverLat, driverLong, pickup_lat, pickup_long, dropoff_lat, dropoff_long, mapInstance, datasourceRef) {

    const routeData1 = await fetchRoute(
      driverLat,
      driverLong,
      pickup_lat,
      pickup_long
    );

    const routeData2 = await fetchRoute(
      pickup_lat,
      pickup_long,
      dropoff_lat,
      dropoff_long
    );

    if (!routeData1 || !routeData2) {
      console.error("Failed to fetch route data");
      return;
    }

    const route1 = routeData1.routes[0];
    const route2 = routeData2.routes[0];

    const routeCoordinates1 = route1.legs.flatMap((leg) =>
      leg.points.map((point) => [point.longitude, point.latitude])
    );

    const routeCoordinates2 = route2.legs.flatMap((leg) =>
      leg.points.map((point) => [point.longitude, point.latitude])
    );

    if (mapInstance.current && datasourceRef.current) {
      const routeLine1 = new window.atlas.data.LineString(routeCoordinates1);
      const routeLine2 = new window.atlas.data.LineString(routeCoordinates2);
      datasourceRef.current.clear();
      datasourceRef.current.add(new window.atlas.data.Feature(routeLine1));
      datasourceRef.current.add(new window.atlas.data.Feature(routeLine2));

      if (!mapInstance.current.layers.getLayerById('routeLayer')) {
        mapInstance.current.layers.add(
          new window.atlas.layer.LineLayer(
            datasourceRef.current,
            'routeLayer',
            {
              strokeColor: ['get', 'color'],
              strokeWidth: 2
            }
          )
        );
      }

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(driverLong), parseFloat(driverLat)]),
        {
          title: 'Driver Location',
          iconImage: "pin-red",
        }
      ));

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(pickup_long), parseFloat(pickup_lat)]),
        {
          title: 'Pickup Location',
          iconImage: "pin-red",
        }
      ));

      datasourceRef.current.add(new window.atlas.data.Feature(
        new window.atlas.data.Point([parseFloat(dropoff_long), parseFloat(dropoff_lat)]),
        {
          title: 'Dropoff Location',
          iconImage: "pin-red",
        }
      ));

      if (!mapInstance.current.layers.getLayerById('symbolLayer')) {
        mapInstance.current.layers.add(
          new window.atlas.layer.SymbolLayer(datasourceRef.current, null, {
            iconOptions: {
              image: ["get", "iconImage"],
              allowOverlap: true,
              ignorePlacement: true,
            },
            textOptions: {
              textField: ["get", "title"],
              offset: [0, 1],
            },
            filter: [
              "any",
              ["==", ["geometry-type"], "Point"],
              ["==", ["geometry-type"], "MultiPoint"],
            ],
          })
        );
      }
    }
  }

  export async function loadRoute(startLat, startLong, end_lat, end_long, mapInstance, datasourceRef) {
    const routeData = await fetchRoute(startLat, startLong, end_lat, end_long);

    if (!routeData) {
        console.error("Failed to fetch route data");
        return;
    }

    const route = routeData.routes[0];

    const routeCoordinates = route.legs.flatMap((leg) =>
        leg.points.map((point) => [point.longitude, point.latitude])
    );

    if (mapInstance.current && datasourceRef.current) {
        const routeLine = new window.atlas.data.LineString(routeCoordinates);
        datasourceRef.current.clear();
        datasourceRef.current.add(new window.atlas.data.Feature(routeLine));

        if (!mapInstance.current.layers.getLayerById('routeLayer')) {
            mapInstance.current.layers.add(
                new window.atlas.layer.LineLayer(datasourceRef.current, 'routeLayer', {
                    strokeColor: "blue",
                    strokeWidth: 3,
                })
            );
        }

        datasourceRef.current.add(new window.atlas.data.Feature(
            new window.atlas.data.Point([parseFloat(startLong), parseFloat(startLat)]),
            {
                title: 'Start Location',
                iconImage: "pin-blue",
            }
        ));

        datasourceRef.current.add(new window.atlas.data.Feature(
            new window.atlas.data.Point([parseFloat(end_long), parseFloat(end_lat)]),
            {
                title: 'End Location',
                iconImage: "pin-red",
            }
        ));

        if (!mapInstance.current.layers.getLayerById('symbolLayer')) {
            mapInstance.current.layers.add(
                new window.atlas.layer.SymbolLayer(datasourceRef.current, null, {
                    iconOptions: {
                        image: ["get", "iconImage"],
                        allowOverlap: true,
                        ignorePlacement: true,
                    },
                    textOptions: {
                        textField: ["get", "title"],
                        offset: [0, 1],
                    },
                    filter: [
                        "any",
                        ["==", ["geometry-type"], "Point"],
                        ["==", ["geometry-type"], "MultiPoint"],
                    ],
                })
            );
        }
    }
}

export async function handleClearRoute(datasourceRef) {
    if (datasourceRef.current) {
      datasourceRef.current.clear();
    }
}