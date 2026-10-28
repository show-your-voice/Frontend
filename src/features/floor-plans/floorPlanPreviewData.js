import creativeBuilding1F from '../../assets/floor-plans/creative-building-1f.png'

export const creativeBuildingFloorPattern = /^창의관\s*\d+\s*층$/

export function splitPlacesByDisplayType(places) {
  return places.reduce((groups, place) => {
    if (creativeBuildingFloorPattern.test(place.name)) groups.floorPlaces.push(place)
    else groups.quickPlaces.push(place)
    return groups
  }, { floorPlaces: [], quickPlaces: [] })
}

export const floorPlanPreviewData = {
  places: [
    { id: 1, name: '창의관 1층', image_url: creativeBuilding1F },
    { id: 2, name: '창의관 2층', image_url: null },
    { id: 3, name: '창의관 3층', image_url: null },
    { id: 4, name: '창의관 4층', image_url: null },
    { id: 5, name: '창의관 5층', image_url: null },
    { id: 6, name: '우정관', image_url: null },
    { id: 7, name: '운동장', image_url: null },
  ],
  rooms: [
    { id: 1, name: '화장실(남)', place_id: 1 },
    { id: 2, name: '임베디드1실', place_id: 1 },
    { id: 3, name: '1-2반', place_id: 1 },
    { id: 4, name: '독서실', place_id: 1 },
  ],
}
