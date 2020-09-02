import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Login: {
      path: 'login'
    },
    Root: {
      path: 'root',
      screens: {
        Home: 'home',
        DeliverHome: 'deliverhome',
      },
    },
  },
};
