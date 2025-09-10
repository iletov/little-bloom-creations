import React from 'react';

export const SoundCloud = () => {
  const userId = 149821089;
  const user = 'nevena_tsoneva_official';
  const userListProperty = 'favorites';
  const artwork = 'true';
  const buying = 'true';

  return (
    <div className="global-padding-sm">
      {/* <iframe width="100%" height="466" scrolling="no" frameBorder="no" allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/${userId}/${userListProperty}&amp;color=00FF00&show_artwork=${artwork}`}>
        </iframe> */}

      <iframe
        width="100%"
        height="370"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${user}&amp;color=00FF00&show_artwork=${artwork}&buying=${true}`}></iframe>
    </div>
  );
};
