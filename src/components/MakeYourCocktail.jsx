import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Select from './Select';
import './makeYourCocktail.css';
import './Cocktails.css';
import CocktailList from './CocktailList';
import './home.css';

class MakeYourCocktail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktails: [],
      allCocktails: [],
      ingredientsList: [],
      keywords1: null,
      keywords2: null,
      cocktails1: [],
      cocktails2: [],
      intersection: [],
      showYourCocktails: true,
      showDescription: true,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.keywords1 !== prevState.keywords1) {
      this.searchIngredient1();
    }
    if (this.state.keywords2 !== prevState.keywords2) {
      this.searchIngredient2();
    }
  }

  setKeywords1 = (keywords1) => this.setState({ keywords1 });

  setKeywords2 = (keywords2) => this.setState({ keywords2 });


  searchIngredient1 = () => {
    const { keywords1 } = this.state;
    Axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${keywords1 !== undefined ? keywords1 : ''}`)
      .then((response) => response.data)
      .then((data) => {
        this.setState({ cocktails1: data.drinks });
      });
  }

  searchIngredient2 = () => {
    const { keywords2 } = this.state;
    Axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${keywords2 !== undefined ? keywords2 : ''} `)
      .then((response) => response.data)
      .then((data) => {
        this.setState({ cocktails2: data.drinks });
      });
  }

  showYourCocktails =() => {
    this.setState({
      showYourCocktails: false,
    });
  }

  showDescription =() => {
    this.setState({
      showDescription: false,
    });
  }

  getData = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const requests = alphabet.split('').map((letter) => (
      Axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`,
      )
    ));
    Axios.all(requests).then(Axios.spread((...responses) => {
      let { allCocktails } = this.state;
      let { ingredientsList } = this.state;

      responses.forEach((response) => {
        const { data } = response;
        if (data.drinks !== null) {
          data.drinks.forEach((drink) => {
            ingredientsList = [
              ...ingredientsList,
              drink.strIngredient1,
              drink.strIngredient2,
              drink.strIngredient3,
              drink.strIngredient4,
              drink.strIngredient5,
              drink.strIngredient6,
              drink.strIngredient7,
              drink.strIngredient8,
              drink.strIngredient9,
              drink.strIngredient10,
              drink.strIngredient11,
              drink.strIngredient12,
              drink.strIngredient13,
              drink.strIngredient14,
              drink.strIngredient15,
            ];
          });
          ingredientsList = [...new Set(ingredientsList)];
          ingredientsList = ingredientsList
            .filter((ingredient) => ingredient != null && ingredient !== '')
            .map((ingredient) => ingredient[0].toUpperCase() + ingredient.slice(1));
          ingredientsList.sort();
        }

        allCocktails = [...allCocktails, { coktails: data.drinks }];
      });

      this.setState({
        ingredientsList,
        allCocktails,
      });
    }));
  };

  cocktailListSort = (cocktail) => {
    this.setState({ intersection: cocktail });
  }

  render() {
    const cocktailNumber = this.state.intersection.length;
    return (
      <div>
        <Link className="homeButton" to="/">
          X
        </Link>
        <div>
          <div className="text">
            <div className="makeYourCocktail">
              <div className="searchBar">
                <h2>Yours ingredients !</h2>
                <Select cocktailListSort={this.cocktailListSort} setKeywords1={this.setKeywords1} setKeywords2={this.setKeywords2} cocktailsList={this.state.allCocktails} ingredientsList={this.state.ingredientsList} onSearch1={this.searchIngredient1} onSearch2={this.searchIngredient2} />
              </div>
              <div>
                <p>Number of cocktails: {cocktailNumber} </p>
                <CocktailList list={this.state.intersection === undefined ? [''] : this.state.intersection} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MakeYourCocktail;
