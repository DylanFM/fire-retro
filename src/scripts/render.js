import h from 'virtual-dom/h';
import loading from './components/loading';
import header from './components/header';
import controls from './components/controls';
import timeline from './components/timeline';
import summary from './components/summary';

// Render the app's DOM tree

export default (state) => {
  if (state.loading) {
    return loading(state);
  } else {
    return h('section', {
      className: state.layers.hex ? 'layer-hex' : 'layer-points'
    }, [
      header(state),
      controls(state),
      timeline(state),
      summary(state)
    ]);
  }
};
