/* Black Friday — edite aqui as datas e os % de desconto (deixe "X" até definir) */
(function () {
  var BF = {
    inicio: "20/11",
    fim: "30/11",
    off: {
      pilates: "", miofascial: "10", drenagem: "10", massagem: "10", fisio: "",
      essencial: "", equilibrio: "", premium: "", trimestral: "", terapias: "10", consulta: "", aulas: ""
    }
  };
  function fill() {
  document.querySelectorAll("[data-bf]").forEach(function (el) {
    el.textContent = BF[el.dataset.bf];
  });
  document.querySelectorAll("[data-bf-off]").forEach(function (el) {
    var v = BF.off[el.dataset.bfOff];
    if (!v) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    el.textContent = v + "% OFF";
  });
}
