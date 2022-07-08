$(document).ready(function () {
  addModalObserver();
});
function addModalObserver() {
  let open = false;
  const observerPupModal = new MutationObserver((mutations, obsPM) => {
    const pupModal = document.querySelector(".pkpmodal");

    if (document.contains(pupModal)) {
      if (!open){
          addSeachObserver();
          open = !open
          //obsPM.disconnect();
          return;
      }
    }
    else{
        open = false
    }

  });

  observerPupModal.observe(document, {
    childList: true,
    subtree: true,
  });
}
function addSeachObserver() {
  const observerSearch = new MutationObserver((mutations, obsS) => {
    const pkpmodalSearch = document.querySelector("#pkpmodal-search"); 
    if (document.contains(pkpmodalSearch)) {
      const input = pkpmodalSearch.querySelector("input");
      input.addEventListener("change", (event) => {
        setTimeout(() => {
          getOrderForm();
        }, 500);
      });

      obsS.disconnect();
    }
  });

  observerSearch.observe(document, {
    childList: true,
    subtree: true,
  });
}


function getOrderForm() {
vtexjs.checkout.getOrderForm().then((orderForm) => {
  getPupDistance(orderForm);
});
}

function getPupDistance(orderForm) {
const logisticsInfoSlas = orderForm.shippingData.logisticsInfo
  .map((logisticInfo) => {
    return logisticInfo.slas;
  })
  .flat();

const slasPUP = logisticsInfoSlas.filter((sla) => {
  return sla.deliveryChannel === "pickup-in-point";
});
const slas = [];
slasPUP.forEach((sla) => {
  if (!slas.some((s) => s.id === sla.id)) {
    slas.push({
      id: sla.id,
      value: sla,
    });
  }
});
slas.forEach((sla) => {
  const { pickupDistance } = sla.value;
  addSectionObserver(sla.id, sla.value.pickupDistance);
});
}

function updatePupElements(id, pickupDistance) {
  //validar que exista el elemento
  const parseId = id.replace(" ", "-").replace("(", "").replace(")", "");
  const pkpmodalPointsList = document.querySelector(".pkpmodal-points-list");
  if(typeof(pkpmodalPointsList) && pkpmodalPointsList != null){
    const element = pkpmodalPointsList.querySelector("#" + parseId);
    const distanceElement = element.querySelector(
        ".pkpmodal-pickup-point-distance"
    );
    const actualDistance = distanceElement.textContent;
    const unit = actualDistance.split(" ")[1];
    const parsePickupDistance = parseFloat(pickupDistance)
        .toFixed(1)
        .replace(".", ",");
    const newDistance = parsePickupDistance + " " + unit;
    distanceElement.textContent = newDistance;
  }
}

function addSectionObserver(id, pickupDistance) {
  let open = false;
  const observerSection = new MutationObserver((mutations, obsPM) => {
  const pickupPointDistance = document.querySelector(".pkpmodal-pickup-point-distance");

  if (document.contains(pickupPointDistance)) {
      if (!open){
          updatePupElements(id, pickupDistance);
          open = !open
          //obsPM.disconnect();
          return;
      }
  }
  else{
      open = false
  }

  });

  observerSection.observe(document, {
  childList: true,
  subtree: true,
  });
}