import { brand } from "@/lib/brand";
import { brl, FREE_SHIPPING_LABEL, FREE_SHIPPING_MIN, STANDARD_SHIPPING } from "@/lib/bundles";
import {
  CORES,
  CORES_OPTION,
  coresLabel,
  KIT_HANDLE,
  OFERTAS,
  QTD_OPTION,
  qtdLabel,
  type Cor,
} from "@/lib/catalog-data";

export { CORES, CORES_OPTION, coresLabel, KIT_HANDLE, OFERTAS, QTD_OPTION, qtdLabel, type Cor };

/** Quantidade que já vem marcada na página do produto. */
export const QTD_PADRAO = 1;

/** Selo de cada oferta (só o que é verdade sem depender de número de vendas). */
export const SELO_OFERTA: Record<number, string> = {
  2: "Ideal para irmãos",
  3: "Menor preço por carrinho",
};

/** Medidas e limites informados pelo fornecedor. */
export const FICHA = {
  idade: "3 a 8 anos",
  pesoMax: "30 kg",
  largura: "65 cm",
  altura: "48 cm",
} as const;

export const corInfo = (id: string) => CORES.find((c) => c.id === id) ?? CORES[0];

/** "Azul + Rosa" → ["Azul", "Rosa"]. */
export const coresDe = (label: string) => label.split(" + ").filter(Boolean) as Cor[];

export const RECURSOS = [
  { t: "Joystick fácil", d: "Dois joysticks: a criança aprende a pilotar em minutos." },
  { t: "Giro 360°", d: "Anda, faz curva e gira no lugar como no parque." },
  { t: "Luzes de LED", d: "A base acende e deixa cada volta mais divertida." },
  { t: "Para-choque", d: "Borda emborrachada em volta para as batidinhas." },
] as const;

/** Perguntas da página do produto e de /faq. */
export const FAQ_KIT: readonly { q: string; a: string }[] = [
  {
    q: "Para qual idade é?",
    a: `Para crianças de ${FICHA.idade}, com até ${FICHA.pesoMax}. O carrinho mede ${FICHA.largura} de largura por ${FICHA.altura} de altura. Brinque sempre com um adulto por perto.`,
  },
  {
    q: "Como a criança pilota?",
    a: "Com os dois joysticks ao lado do banco. Com eles a criança anda para frente e para trás, faz curvas e gira 360° no lugar. A maioria pega o jeito na primeira volta.",
  },
  {
    q: "Quais cores tem?",
    a: `${CORES.map((c) => c.id)
      .join(", ")
      .replace(
        /, ([^,]*)$/,
        " e $1",
      )}. Levando 2 ou 3 carrinhos, você escolhe a cor de cada um, por exemplo um azul e um rosa.`,
  },
  {
    q: "Como funciona a bateria?",
    a: "O carrinho é elétrico e usa bateria recarregável. Carregue antes da primeira brincadeira e siga o manual para o tempo de carga.",
  },
  {
    q: "É seguro?",
    a: "Tem cinto de segurança, assento com encosto e para-choque emborrachado em volta. Use em piso liso, longe de escadas, piscina e rua, e sempre com um adulto olhando.",
  },
  {
    q: "Dá para usar dentro de casa?",
    a: "Sim. Ele foi feito para piso liso, como cerâmica, porcelanato, madeira e quintal cimentado. Evite grama, terra, areia e lugares molhados.",
  },
  {
    q: "É um bom presente?",
    a: "É um dos presentes que mais empolgam nessa idade: aniversário, Dia das Crianças e Natal. No checkout dá para pedir embrulho de presente com cartão.",
  },
  {
    q: "Quando meu pedido chega?",
    a: `${FREE_SHIPPING_LABEL}${FREE_SHIPPING_MIN > 0 ? `; abaixo disso, o Frete Padrão custa ${brl(STANDARD_SHIPPING.price)} e chega em ${STANDARD_SHIPPING.days} dias úteis` : ""}. No frete grátis, o prazo médio é de ${brand.prazoEntrega} depois da confirmação do pagamento. Você recebe o código de rastreio quando o pedido sai. O prazo é uma estimativa, não uma data garantida.`,
  },
  {
    q: "Como funciona a garantia?",
    a: `Você tem ${brand.garantiaDias} dias a partir da entrega para pedir a devolução do dinheiro. Fale com a gente dentro desse prazo para começar. As regras completas estão na página de garantia e devoluções.`,
  },
];

/** As 4 primeiras da home. */
export const FAQ_HOME = [FAQ_KIT[0]!, FAQ_KIT[1]!, FAQ_KIT[4]!, FAQ_KIT[7]!];
