import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AddIngredients } from '../../shopping-list/store/shopping-list.actions';
import { Observable } from 'rxjs';
import { RecipeFeatureState, RecipeState } from '../store/recipe.reducers';
import { take } from 'rxjs/operators';
import { DeleteRecipe } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeState: Observable<RecipeState>;
  id: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<RecipeFeatureState>) { }

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.id = +param['id'];
      this.recipeState = this.store.pipe(select('recipes'));
    });
  }

  onAddToShoppingList() {
    this.store.pipe(select('recipes'), take(1))
      .subscribe((recipeState: RecipeState) => {
        this.store.dispatch(new AddIngredients(recipeState.recipes[this.id].ingredients));
      });
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
