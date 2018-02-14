package controllers;

import play.mvc.*;

import views.html.Game.*;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's home page.
 */
public class SlotMachineController extends Controller {

    private String title = "Welcome | Play Framework Slot Machine";
    private String statisticsTitle = "Statistics | Play Framework Slot Machine";

    public Result play() {
        return ok(slotmachine.render(title)); //Renders Main Game page with passed title
    }

    public Result showStatistics() {
        return ok(statistics.render(statisticsTitle)); //Renders Statistics page with passed title
    }

}