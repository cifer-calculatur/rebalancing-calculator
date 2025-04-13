package main

import (
    "fmt"
    "syscall/js"
    "github.com/smichaelsen/rebalancing-calculator/calculator"
    "github.com/smichaelsen/rebalancing-calculator/structs"
)

func calculateRebalance(this js.Value, args []js.Value) interface{} {
	// --- Input Validation ---
	if len(args) != 2 {
		// Handle error: incorrect number of arguments
		// Returning an error object to JS is often better than panicking
		errStr := fmt.Sprintf("calculateRebalance: expected 2 arguments (categories array, amount number), got %d", len(args))
		fmt.Println(errStr) // Log on Go side
		// Create a JS Error object to return
		errorConstructor := js.Global().Get("Error")
		return errorConstructor.New(errStr)
	}

	jsCategoriesArray := args[0]
	jsAmountToInvest := args[1]

	// Validate argument types (basic check)
    // A more robust check for Array: js.Global().Get("Array").Call("isArray", jsCategoriesArray).Bool()
	if jsCategoriesArray.Type() != js.TypeObject || jsCategoriesArray.Get("length").Type() != js.TypeNumber {
        errStr := "calculateRebalance: first argument must be an Array of category objects"
		fmt.Println(errStr)
        errorConstructor := js.Global().Get("Error")
		return errorConstructor.New(errStr)
	}
	if jsAmountToInvest.Type() != js.TypeNumber {
        errStr := "calculateRebalance: second argument must be a Number (amount to invest)"
        fmt.Println(errStr)
        errorConstructor := js.Global().Get("Error")
		return errorConstructor.New(errStr)
	}

	// --- Processing ---
	calculatorInstance := calculator.NewInvestmentCalculator()

	// Process Categories from jsCategoriesArray (args[0])
	categoriesLength := jsCategoriesArray.Length()
	goCategories := make([]structs.Category, 0, categoriesLength) // Pre-allocate slice capacity

	for i := 0; i < categoriesLength; i++ {
		jsCategoryObject := jsCategoriesArray.Index(i)

		if jsCategoryObject.Type() != js.TypeObject {
            // Handle error: element in array is not an object
            errStr := fmt.Sprintf("calculateRebalance: element at index %d in categories array is not an object", i)
            fmt.Println(errStr)
            errorConstructor := js.Global().Get("Error")
		    return errorConstructor.New(errStr)
		}

        // Extract data, converting JS values to Go types
        // Add checks for missing properties if necessary (jsValue.IsUndefined())
		category := structs.Category{
			Name:    jsCategoryObject.Get("Name").String(),
			Target:  jsCategoryObject.Get("Target").Float(),
			Current: jsCategoryObject.Get("Current").Float(),
			Locked:  false,  // Assumes "Locked" exists and is boolean
			Investment: 0, // Investment is calculated, initialize to 0
		}
		goCategories = append(goCategories, category) // Append to the Go slice
		// Alternatively, directly add to calculator if AddCategory takes one at a time
		// calculatorInstance.AddCategory(category)
	}

	// If your calculator has a method like AddCategories (plural):
	// calculatorInstance.AddCategories(goCategories)
	// Otherwise, add them one by one:
	for _, cat := range goCategories {
		calculatorInstance.AddCategory(cat)
	}


	// Process Amount to Invest from jsAmountToInvest (args[1])
	amountToInvest := jsAmountToInvest.Float() // Assumes it's a number
	calculatorInstance.SetAmountToInvest(amountToInvest)

	// --- Calculation & Output ---
	result := calculatorInstance.CalculateAllocation()

	// Convert result back to JS format using the previous function
	return categoriesToJS(result)
}

func categoriesToJS(categories []structs.Category) js.Value {
	jsArray := js.Global().Get("Array").New()

	for i, c := range categories {
		categoryMap := map[string]interface{}{
			"Name":               c.Name,
			"Current":            c.Current,
			"Target":             c.Target,
			"Locked":             c.Locked,
			"Investment":         c.Investment,
			"AchievedAllocation": c.AchievedAllocation,
		}

		jsArray.SetIndex(i, js.ValueOf(categoryMap))
	}

	return jsArray
}

func registerCallbacks() {
	js.Global().Set("calculateRebalance", js.FuncOf(calculateRebalance))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c // Keep running
}
