import h from 'virtual-dom/h';

export default (state) => {
  var nodes = [
    h('h1', 'Incidents • 2014–15')
  ];

  // Add more info to the header
  if (state.moreInfo === true) {
    nodes[1] = h('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula vitae nisl a faucibus. Aenean a eros vel justo venenatis rutrum. Maecenas massa tellus, ultricies quis tristique vel, commodo et risus. Ut bibendum eros dictum.');
  }

  nodes.push(h('a#moreInfoToggle.moreInfo', {
    href:   '#',
    title:  (state.moreInfo === true ? 'Show less information' : 'Show more information'),
  }, (state.moreInfo === true ? '[-] less info' : '[+] more info')));

  return h('header', nodes);
};
