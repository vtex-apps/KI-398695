$(document).ready(function () {
  const pkpmodalSearch = document.querySelector("#pkpmodal-search");
  const input = pkpmodalSearch.querySelector("input");

  input.addEventListener("change", (event) => {
    console.log("change", event.target.value);
    setTimeout(() => {
      getOrderForm();
    }, 100);
  });
});

function getOrderForm() {
  vtexjs.checkout.getOrderForm().then((orderForm) => {
    getPupDistance(orderForm);
  });
}

function getPupDistance(orderForm) {
  console.log("getPupDistance start", orderForm);
  const slas = orderForm.shippingData.logisticsInfo
    .map((logisticInfo) => {
      return logisticInfo.slas;
    })
    .flat();

  const slasPUP = slas.filter((sla) => {
    return sla.deliveryChannel === "pickup-in-point";
  });
  console.log("slasPUP", slasPUP);

  const slasIds = [];
  const slasAux = [];
  slasPUP.forEach((sla) => {
    if (!slasIds.includes(sla.id)) {
      slasIds.push(sla.id);
      slasAux.push(sla);
    }
  });

  console.log("slasIds", slasIds);
  console.log("slasAux", slasAux);

  slasAux.forEach((sla, index) => {
    const { pickupDistance } = sla;
    console.log("pickupDistance", pickupDistance);
    updatePupElements(slasIds[index],pickupDistance);
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

/*
R. Assis Bueno - Botafogo, Rio de Janeiro - RJ, 22280, Brasil
"1_141125d"
0.9423947334289551
2.3011231422424316

R. Fonte da Saudade - Lagoa, Rio de Janeiro - RJ, 22471-210, Brasil
pickupPointId: "1_141125d"
2.2600743770599365
3.8657522201538086
*/

/*
Ponemos R. Assis Bueno - Botafogo, Rio de Janeiro - RJ, 22280, Brasil
-> Trae bien su distancia en el front y en el orderForm

Ponemos R. Fonte da Saudade - Lagoa, Rio de Janeiro - RJ, 22471-210, Brasil
-> Trae mal su distancia en el front y pero bien en el orderForm

Ponemos nuevamente R. Assis Bueno - Botafogo, Rio de Janeiro - RJ, 22280, Brasil
-> Trae mal su distancia en el front y mal en el orderForm, deja las distancias del anterior PUP


Dada una direccion -> devolveme los pups cercanos


Br. Metropolis, Barrios Unidos, Bogotá, Colombia -> 0,4

Acapulco, Engativá, Bogotá, Colombia -> 1,6

*/
