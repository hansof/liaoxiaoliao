export const pushHistory = () => {
    let state = { title: '', url: '' }
    window.history.pushState(state, state.title, state.url)
  }