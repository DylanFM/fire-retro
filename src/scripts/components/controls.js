import h from 'virtual-dom/h';

function radio(group, label, id, checked) {
  return h('label', {
      className: (checked ? 'checked' : '')
    }, [
      label,
      h('input', {
        id:       id,
        type:     'radio',
        name:     group,
        checked:  (checked ? 'checked' : ''),
        value:    id
      })
    ]
  );
}

export default (state) => {
  return h('.controls#controls', [
    h('ul.controlLayers', [
      h('li', radio('visibleLayer', 'Points', 'points', state.layers.points)),
      h('li', radio('visibleLayer', 'Hex', 'hex', state.layers.hex)),
    ]),
    h('ul.controlPaused', [
      h('li', radio('play', 'Play', 'play', !state.paused)),
      h('li', radio('play', 'Pause', 'pause', state.paused))
    ]),
  ]);
};
