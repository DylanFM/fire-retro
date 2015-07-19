import h from 'virtual-dom/h';

function radio(label, id, checked) {
  return h('label', {
      className: (checked ? 'checked' : '')
    }, [
      label,
      h('input', {
        id: id,
        type: 'radio',
        name: 'layer',
        checked: (checked ? 'checked' : ''),
        value: id
      })
    ]
  );
}

export default (state) => {
  return h('ul.controls#controls', [
    h('li', radio('Hex', 'hex', state.layers.hex)),
    h('li', radio('Points', 'points', state.layers.points))
  ]);
};
