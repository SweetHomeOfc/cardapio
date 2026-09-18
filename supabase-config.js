(function () {
  const TAXAS = {
    "baianao": 6,
    "casas novas": 7,
    "parque ecologico": 7,
    "areal": 7,
    "fontana": 8,
    "cambolo": 8,
    "quinta do descobrimento": 8,
    "mirante": 8,
    "paraguai": 8,
    "valdete": 8,
    "parracho": 8,
    "belo campo": 8,
    "vista alegre": 8,
    "rio da vila": 9,
    "riacho doce": 9,
    "vila verde": 10,
    "aeronautica": 10,
    "vila vitoria": 10,
    "camboata": 10,
    "vila jardim": 14,
    "porto alegre": 14,
    "roca do povo": 15,
    "tabapiri": 12,
    "rodoviaria": 13,
    "aeroporto": 13,
    "cidade historica": 13,
    "centro": 15,
    "campinho": 15,
    "outeiro da gloria": 12,
    "outeiro sao francisco": 14,
    "gaudi": 12,
    "padova": 10,
    "curuipe": 14,
    "mundai baixo": 16,
    "mundai alto": 16,
    "taperapuan": 18,
    "xurupita": 18,
    "village i": 18,
    "village ii": 20,
    "village iii": 20,
    "pataxos": 20,
    "miramar": 30,
    "ponta grande": 25,
    "coroa vermelha": 40,
    "cabralia": 70,
    "mangabeira": 18,
    "monte das oliveiras": 18,
    "faisao": 22,
    "ufsb": 22,
    "faculdade atenas": 18,
    "porto bello": 18,
    "agrovila": 30,
    "arraial baixo": 75,
    "arraial alto": 85
  };

  function normalizar(v) {
    return String(v || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[\/,&.-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function taxaEntrega() {
    const campo = document.getElementById("neighborhood");
    const bairro = normalizar(campo ? campo.value : "");

    if (!bairro) return 0;

    for (const nome in TAXAS) {
      if (bairro === nome || bairro.includes(nome)) {
        return TAXAS[nome];
      }
    }

    return 0;
  }

  function iniciar() {
    if (typeof coupons === "undefined") {
      setTimeout(iniciar, 300);
      return;
    }

    /*
     * Cria o cupom diretamente na lista usada
     * pelo index.html original.
     */
    const existe = coupons.some(
      c => String(c.code || "").toUpperCase() === "BOASVINDAS"
    );

    if (!existe) {
      coupons.push({
        code: "BOASVINDAS",
        active: true,
        discount_type: "fixed",
        discount_value: 10,
        min_order: 0,
        expires_at: null
      });
    }

    /*
     * Quando o bairro mudar, atualiza o total mostrado.
     */
    function atualizarTotal() {
      if (typeof getCartSubtotal !== "function") return;

      const subtotal = Number(getCartSubtotal()) || 0;
      const desconto =
        typeof getAppliedDiscount === "function"
          ? Number(getAppliedDiscount()) || 0
          : 0;

      const entrega = taxaEntrega();

      const total = Math.max(
        0,
        subtotal - desconto + entrega
      );

      const el = document.getElementById("total");

      if (el) {
        el.innerHTML =
          `<span style="font-size:11px;color:#777;font-weight:600">
            Subtotal ${money(subtotal)}
            ${desconto > 0
              ? `<br><span class="discountRow">− Cupom ${money(desconto)}</span>`
              : ""}
            ${entrega > 0
              ? `<br>🚚 Entrega ${money(entrega)}`
              : ""}
          </span>
          <strong>${money(total)}</strong>`;
      }
    }

    const bairro =
      document.getElementById("neighborhood");

    if (bairro) {
      bairro.addEventListener("input", atualizarTotal);
      bairro.addEventListener("change", atualizarTotal);
    }

    /*
     * Atualiza o total depois de aplicar cupom.
     */
    const botao =
      document.querySelector(".couponApply");

    if (botao) {
      botao.addEventListener("click", function () {
        setTimeout(atualizarTotal, 100);
      });
    }

    atualizarTotal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

})();
