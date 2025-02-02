import React from "react";
import { Switch } from "react-router-dom";
import api from "../utils/api";

import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";  // хорошо бы пошарить, т.к. используется и в других модулях
import Card from './Card';
import { CurrentUserContext } from 'shared-usercontext_shared-library';

function CardsApp() {
  const currentUser = React.useContext(CurrentUserContext);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);  
  const [cards, setCards] = React.useState([]);

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  // Запрос к API за информацией о массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getCardsInfo()
      .then(([cardData]) => {
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <Switch>
            <Route exact>
                {
                    () => currentUser ?
                    <cardsApp>
                      <section className="profile page__section">
                        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
                      </section>
                      <section className="places page__section">
                          <ul className="places__list">
                          {cards.map((card) => (
                              <Card
                              key={card._id}
                              card={card}
                              onCardClick={handleCardClick}
                              onCardLike={handleCardLike}
                              onCardDelete={handleCardDelete}
                              />
                          ))}
                          </ul>
                      </section>
                    </cardsApp>
                    : <Redirect to="./signin" /> // URL условный , в общем надо перенаправить на авторизацию
                }
            </Route>
        </Switch>
        <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onAddPlace={handleAddPlaceSubmit}
            onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default CardsApp;
