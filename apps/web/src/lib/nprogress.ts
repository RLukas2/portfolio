import NProgress from 'nprogress';

/**
 * Configure NProgress for route transitions
 * Shows a slim loading bar at the top of the page
 */
const configuredNProgress = NProgress.configure({
  showSpinner: false, // Hide the spinner, just show the bar
  trickleSpeed: 200, // How fast the bar moves
  minimum: 0.08, // Minimum percentage
  easing: 'ease', // CSS easing
  speed: 200, // Animation speed
});

export default configuredNProgress;
