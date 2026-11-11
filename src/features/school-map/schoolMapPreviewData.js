export const buildingFloorPattern = /^(창의관|우정관)\s*([1-5])\s*층$/

export function getRoomAreaId(placeId, roomName) {
  return `${placeId}:${roomName}`
}

export function splitPlacesByDisplayType(places) {
  return places.reduce((groups, place) => {
    if (buildingFloorPattern.test(place.name)) groups.floorPlaces.push(place)
    else groups.quickPlaces.push(place)
    return groups
  }, { floorPlaces: [], quickPlaces: [] })
}

export const schoolMapPreviewData = {
  places: [
    { id: 1, name: '창의관 1층' },
    { id: 2, name: '창의관 2층' },
    { id: 3, name: '창의관 3층' },
    { id: 4, name: '창의관 4층' },
    { id: 5, name: '창의관 5층' },
    { id: 6, name: '우정관 1층' },
    { id: 8, name: '우정관 2층' },
    { id: 9, name: '우정관 3층' },
    { id: 10, name: '우정관 4층' },
    { id: 11, name: '우정관 5층' },
    { id: 7, name: '운동장' },
  ],
  rooms: [
    { id: 1, name: '화장실(남)', place_id: 4 },
    { id: 2, name: '임베디드1실', place_id: 4 },
    { id: 3, name: '1-2반', place_id: 4 },
    { id: 4, name: '독서실', place_id: 10 },
  ],
}
