import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const method = [
  {value: 1, label: '訪問'},
  {value: 2, label: '電話'},
  {value: 3, label: 'メール'},
  {value: 4, label: 'その 他'}
]

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  serverLink: 'http://104.156.230.143:2083/',
  method: method,
};
