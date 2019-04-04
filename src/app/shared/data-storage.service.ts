import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const token = this.authService.getToken();

    return this.http.put<Recipe[]>(
      `${environment.firebaseURL}/recipes.json?auth=${token}`,
      this.recipeService.getRecipes()
    );
  }

  getRecipes() {
    const token = this.authService.getToken();

    return this.http.get<Recipe[]>(
      `${environment.firebaseURL}/recipes.json?auth=${token}`
    ).subscribe((recipes: Recipe[]) => {
      this.recipeService.setRecipes(recipes);
    });
  }

}
