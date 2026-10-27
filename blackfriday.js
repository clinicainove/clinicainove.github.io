/* Black Friday — edite aqui as datas e os % de desconto (deixe "X" até definir) */
(function () {
  var BF = {
    inicio: "XX/XX",
    fim: "XX/XX",
    off: {
      pilates: "X", miofascial: "X", drenagem: "X", massagem: "X", fisio: "X",
      essencial: "X", equilibrio: "X", premium: "X", trimestral: "X", terapias: "X", consulta: "X", aulas: "X"
    }
  };
  function fill() {
    document.querySelectorAll("[data-bf]").forEach(function (el) { el.textContent = BF[el.dataset.bf]; });
    document.querySelectorAll("[data-bf-off]").forEach(function (el) { el.textContent = BF.off[el.dataset.bfOff] + "% OFF"; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();