import { Actions, Effect, ofType } from '@ngrx/effects';
import { FETCH_RECIPES, FetchRecipes, SET_RECIPES, STORE_RECIPES } from './recipe.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { RecipeFeatureState } from './recipe.reducers';

@Injectable()
export class RecipeEffects {

  @Effect()
  recipeFetch = this.recipeActions$.pipe(
    ofType(FETCH_RECIPES),
    switchMap((action: FetchRecipes) => {
      return this.http.get<Recipe[]>(`${environment.firebaseURL}/recipes.json`);
    }),
    map((recipes: Recipe[]) => {
      return {type: SET_RECIPES, payload: recipes};
    })
  );

  @Effect({dispatch: false})
  recipeStore = this.recipeActions$.pipe(
    ofType(STORE_RECIPES),
    withLatestFrom(this.store.pipe(select('recipes'))),
    switchMap(([action, state]) => {
      return this.http.put<Recipe[]>(`${environment.firebaseURL}/recipes.json`, state.recipes);
    })
  );

  constructor(private recipeActions$: Actions,
              private http: HttpClient,
              private store: Store<RecipeFeatureState>) { }
}
