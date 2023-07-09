export const sharePost = (post) => {
    const domain = window.location.host;
    navigator.clipboard.writeText(`${domain}/PostDetails/${post}`);
  };
  