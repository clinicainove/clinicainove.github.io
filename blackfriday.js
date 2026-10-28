/* Black Friday — edite aqui as datas e os % de desconto (deixe "X" até definir) */
(function () {
  var BF = {
    inicio: "01/11",
    fim: "30/11",
    off: {
      pilates: "20", miofascial: "20", drenagem: "20", massagem: "20", fisio: "20",
      essencial: "20", equilibrio: "20", premium: "20", trimestral: "20", terapias: "20", consulta: "20", aulas: "20"
    }
  };
  function fill() {
    document.querySelectorAll("[data-bf]").forEach(function (el) { el.textContent = BF[el.dataset.bf]; });
    document.querySelectorAll("[data-bf-off]").forEach(function (el) { el.textContent = BF.off[el.dataset.bfOff] + "% OFF"; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
