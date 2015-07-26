import h from 'virtual-dom/h';

export default (state) => {
  var max   = state.loadingProgress.total || 1,
      value = state.loadingProgress.progress || 0;

  return h('div.loading', [
    h('h2', 'Loading'),
    h('progress', { max: max, value: value })
  ]);
};
