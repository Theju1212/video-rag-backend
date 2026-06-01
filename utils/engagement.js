function calculateEngagement(
  likes,
  comments,
  views
) {

  if (!views) return 0;

  return (
    ((likes + comments) / views) *
    100
  ).toFixed(2);

}

module.exports =
  calculateEngagement;