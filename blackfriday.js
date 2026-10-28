/* Black Friday — edite aqui as datas e os % de desconto (deixe "X" até definir) */
(function () {
  var BF = {
    inicio: "01/11",
    fim: "30/11",
    off: {
      pilates: "30", miofascial: "30", drenagem: "30", massagem: "30", fisio: "30",
      essencial: "30", equilibrio: "30", premium: "30", trimestral: "30", terapias: "30", consulta: "30", aulas: "30"
    }
  };
  function fill() {
    document.querySelectorAll("[data-bf]").forEach(function (el) { el.textContent = BF[el.dataset.bf]; });
    document.querySelectorAll("[data-bf-off]").forEach(function (el) { el.textContent = BF.off[el.dataset.bfOff] + "% OFF"; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
