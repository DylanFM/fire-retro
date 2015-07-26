import h from 'virtual-dom/h';
import controls from './components/controls';
import summary from './components/summary';
import timeline from './components/timeline';
import loading from './components/loading';

// Render the app's DOM tree

export default (state) => {
  if (state.loading) {
    return loading(state);
  } else {
    return h('section', {
      className: state.layers.hex ? 'layer-hex' : 'layer-points'
    }, [
      summary(state),
      controls(state),
      timeline(state)
    ]);
  }
};
