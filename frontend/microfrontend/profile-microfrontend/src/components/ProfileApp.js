import React from "react";
import { Switch } from "react-router-dom";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import api from "../utils/api";

import { CurrentUserContext } from 'shared-usercontext_shared-library';

function ProfileApp() {
  const currentUser = React.useContext(CurrentUserContext);
  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <Switch>
            <Route exact>
                {
                    () => currentUser ?
                    <profileApp>
                      <section className="profile page__section">
                        <div className="profile__image" onClick={handleEditAvatarClick} style={imageStyle}></div>
                        <div className="profile__info">
                          <h1 className="profile__title">{currentUser.name}</h1>
                          <button className="profile__edit-button" type="button" onClick={handleEditProfileClick}></button>
                          <p className="profile__description">{currentUser.about}</p>
                        </div>
                      </section>
                    </profileApp>
                    : <Redirect to="./signin" /> // URL условный , в общем надо перенаправить на авторизацию
                }
            </Route>
        </Switch>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={closeAllPopups}
        />
    </CurrentUserContext.Provider>
  );
}

export default ProfileApp;
