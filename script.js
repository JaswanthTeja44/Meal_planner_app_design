const form = document.getElementById('mealForm');
const output = document.getElementById('output');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const diet = document.getElementById('diet').value;
  const allergies = document.getElementById('allergies').value.toLowerCase().split(',').map(a => a.trim()).filter(a => a);
  const ingredientCheckboxes = document.querySelectorAll('input[name="ingredients"]:checked');
  const ingredients = Array.from(ingredientCheckboxes).map(cb => cb.value.toLowerCase());

  if (!ingredients.length) {
    output.innerHTML = '<p>Please select at least one ingredient.</p>';
    return;
  }

  const meals = [
    { name: "Grilled Chicken Salad", diet: "none", ingredients: ["chicken", "lettuce", "tomatoes"], allergens: [] },
    { name: "Vegan Buddha Bowl", diet: "vegan", ingredients: ["quinoa", "chickpeas", "broccoli"], allergens: [] },
    { name: "Keto Omelette", diet: "keto", ingredients: ["eggs", "cheese", "spinach"], allergens: ["dairy"] },
    { name: "Vegetarian Stir Fry", diet: "vegetarian", ingredients: ["tofu", "broccoli", "carrot"], allergens: ["soy"] },
    { name: "Avocado Toast", diet: "vegetarian", ingredients: ["bread", "avocado"], allergens: ["gluten"] },
    { name: "Salmon with Asparagus", diet: "paleo", ingredients: ["salmon", "asparagus", "lemon"], allergens: [] },
    { name: "Spaghetti Marinara", diet: "vegetarian", ingredients: ["spaghetti", "tomatoes", "garlic", "olive oil"], allergens: ["gluten"] },
    { name: "Quinoa Salad", diet: "vegan", ingredients: ["quinoa", "cucumber", "tomatoes", "lemon"], allergens: [] }
  ];

  const filteredMeals = meals.filter(meal => {
    const matchesDiet = diet === "" || diet === "none" || meal.diet === diet;
    const hasAllergens = meal.allergens.some(allergen => allergies.includes(allergen));
    const ingredientsAvailable = meal.ingredients.every(ing => ingredients.includes(ing));
    return matchesDiet && !hasAllergens && ingredientsAvailable;
  });

  if (filteredMeals.length === 0) {
    output.innerHTML = '<p>No meals found matching your criteria.</p>';
    return;
  }

  let html = '<h2>Meal Suggestions:</h2><ul>';
  filteredMeals.forEach(meal => {
    html += `<li><strong>${meal.name}</strong> (${meal.diet})</li>`;
  });
  html += '</ul><h3>Shopping List:</h3><ul>';
  const shoppingSet = new Set();
  filteredMeals.forEach(meal => meal.ingredients.forEach(ing => {
    if (!ingredients.includes(ing)) shoppingSet.add(ing);
  }));
  if (shoppingSet.size === 0) {
    html += '<li>All ingredients available!</li>';
  } else {
    shoppingSet.forEach(item => {
      html += `<li>${item}</li>`;
    });
  }
  html += '</ul>';

  output.innerHTML = html;
});