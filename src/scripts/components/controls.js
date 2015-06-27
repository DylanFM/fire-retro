import h from 'virtual-dom/h';

function radio(label, id, checked) {
  return h('label', [
    h('input', {
      id: id,
      type: 'radio',
      name: 'layer',
      checked: (checked ? 'checked' : ''),
      value: id
    }),
    label
  ]);
}

function radios(layers) {
  return [
    radio('Hex', 'hex', layers.hex),
    radio('Points', 'points', layers.points)
  ];
}

export default (state) => {
  return h('div.controls#controls', radios(state.layers));
};
