import { VideoEditor } from './editorDataTypes';

export const editorDataMock: VideoEditor = {
  options: {},
  timeline: [
    {
      id: 'row-0',
      options: {},
      type: 'video',
      fragments: [
        {
          id: 'fragment-0',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'europe_city.mp4',
          start: 0,
          duration: 90,
          thumbnail:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgwX62cBcrEZu-M2E0ms7sEnlqxoXAkCGzHQ&usqp=CAU',
          options: {}
        },
        {
          id: 'fragment-1',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'ny_city.mp4',
          start: 110,
          duration: 200,
          thumbnail:
            'https://styles.redditmedia.com/t5_2sftr/styles/communityIcon_cfj2la8jdhdb1.png',
          options: {}
        },
        {
          id: 'fragment-2',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'kyiv.mp4',
          start: 410,
          duration: 90,
          thumbnail:
            'https://media-cdn.tripadvisor.com/media/photo-s/08/1e/5e/53/caption.jpg',
          options: {}
        }
      ]
    },
    {
      id: 'row-1',
      options: {},
      type: 'video',
      fragments: [
        {
          id: 'fragment-3',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'kyiv.mp4',
          start: 30,
          duration: 5 * 60 + 20,
          options: {},
          thumbnail:
            'https://media-cdn.tripadvisor.com/media/photo-s/08/1e/5e/53/caption.jpg'
        }
      ]
    },
    {
      id: 'row-2',
      options: {},
      type: 'audio',
      fragments: [
        {
          id: 'fragment-4',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'vivaldi.mp3',
          start: 0,
          duration: 5 * 60 + 30,
          options: {}
        }
      ]
    },
    {
      id: 'row-3',
      options: {},
      type: 'audio',
      fragments: [
        {
          id: 'fragment-5',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'birds.mp3',
          start: 10,
          duration: 70,
          options: {}
        },
        {
          id: 'fragment-6',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          name: 'forrest.mp3',
          start: 120,
          duration: 90,
          options: {}
        }
      ]
    }
  ]
};
