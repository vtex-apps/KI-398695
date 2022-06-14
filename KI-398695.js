$(document).ready(function () {
  addSeachObserver();
  /*const pkpmodalSearch = document.querySelector("#pkpmodal-search");
  const input = pkpmodalSearch.querySelector("input");

  input.addEventListener("change", (event) => {
    console.log("change", event.target.value);
    setTimeout(() => {
      getOrderForm();
    }, 100);
  });*/
});

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
  console.log("slasPUP", slasPUP);

  const slas = [];
  slasPUP.forEach((sla) => {
    if (!slas.some((s) => s.id === sla.id)) {
      slas.push({
        id: sla.id,
        value: sla,
      });
    }
  });

  console.log("slas", slas);

  slas.forEach((sla) => {
    const { pickupDistance } = sla.value;
    console.log("pickupDistance", pickupDistance);
    updatePupElements(sla.id, sla.value.pickupDistance);
  });
  console.log("getPupDistance end");
}

function updatePupElements(id, pickupDistance) {
  //validar que exista el elemento
  const parseId = id.replace(" ", "-").replace("(", "").replace(")", "");
  const pkpmodalPointsList = document.querySelector(".pkpmodal-points-list");
  const element = pkpmodalPointsList.querySelector("#" + parseId);
  const distanceElement = element.querySelector(
    ".pkpmodal-pickup-point-distance"
  );
  console.log("distanceElement", distanceElement);
  const actualDistance = distanceElement.textContent;
  console.log("actualDistance", actualDistance);

  const unit = actualDistance.split(" ")[1];
  console.log("pickupDistance", pickupDistance);
  const parsePickupDistance = parseFloat(pickupDistance)
    .toFixed(1)
    .replace(".", ",");
  const newDistance = parsePickupDistance + " " + unit;
  console.log("newDistance", newDistance);
  distanceElement.textContent = newDistance;
}

function addModalObserver() {
  const observerPupModal = new MutationObserver((mutations, obsPM) => {
    const pupModal = document.querySelector("#pup-modal");

    if (document.contains(pupModal)) {
      console.log('se abrio la modal')
      addSeachObserver();

      obsPM.disconnect();

      return;
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
        console.log("change", event.target.value);
        setTimeout(() => {
          getOrderForm();
        }, 100);
      });

      obsS.disconnect();
    }
  });

  observerSearch.observe(document, {
    childList: true,
    subtree: true,
  });
}

/*

Br. Metropolis, Barrios Unidos, Bogotá, Colombia -> 0,4

Acapulco, Engativá, Bogotá, Colombia -> 1,6

*/
