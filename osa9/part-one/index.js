"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exerciseCalculator_1 = require("./exerciseCalculator");
// const weight = 96
// const height = 2
// const bmiCategory = calculateBMI(weight, height)
// console.log(`Your BMI category is ${bmiCategory}`)
var trainingHours = [3, 0, 2, 4.5, 0, 3, 1];
var target = 2;
var exerciseResults = (0, exerciseCalculator_1.calculateExercises)(trainingHours, target);
console.log(exerciseResults);
