import h from 'virtual-dom/h';

export default (state) => {
  var nodes = [
    h('h1', 'Incidents 2015')
  ];

  // Add more info to the header
  if (state.moreInfo === true) {
    nodes.push(h('p', "You're viewing NSW Rural Fire Service incidents for 2015. The data is coming from an open-source, unofficial API. This API aims to serve both realtime and historical data. There are inaccuracies in this data - bugs and outages have occurred over the past few years."));

    nodes.push(h('nav', [
      h('a', {
        href: 'https://github.com/DylanFM/fire-retro',
        title: 'View the code for this visualisation'
      }, 'Code'),
      h('a', {
        href: 'http://bushfir.es',
        title: 'This is a part of the Bushfires project'
      }, 'Bushfires project'),
      h('a', {
        href: 'http://dylan.fm',
        title: 'This project is the work of Dylan Fogarty-MacDonald'
      }, '@dylanfm')
    ]));
  }

  nodes.push(h('a#moreInfoToggle.moreInfo', {
    href:   '#',
    title:  (state.moreInfo === true ? 'Show less information' : 'Show more information'),
  }, (state.moreInfo === true ? '[-] less info' : '[+] more info')));

  return h('header', nodes);
};
