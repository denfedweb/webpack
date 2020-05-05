import * as $ from "jquery";

function createAnal(): object { 
    let counter = 0;
    let isDestroyed: boolean = false;
    const listener = (): number => counter++;
    $(document).on("click", listener);
    return {
        destroy(){
            $(document).off("click", listener);
            isDestroyed = true;
        },
        getClicks(){
            if(isDestroyed){
                return "analytics destroyed";
            }
            return counter
        }
    }
 }

window['analytic'] = createAnal(); 