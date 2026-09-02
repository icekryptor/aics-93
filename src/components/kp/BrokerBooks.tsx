/* BrokerBooks — схема разницы A-book и B-book для КП брокера.
   Слева сделка проходит сквозь брокера к поставщику ликвидности и брокеру
   достаётся только наценка; справа сделка остаётся внутри и результат клиента
   играет против брокера. Снизу — гибрид: классификатор сортирует поток.
   Один SVG на оба вида КП, палитра через `tone`. */

export default function BrokerBooks({ tone = "dark" }: { tone?: "dark" | "paper" }) {
  const paper = tone === "paper";
  const ink = paper ? "var(--paper-ink)" : "var(--color-runtime-ink)";
  const soft = paper ? "var(--paper-ink-soft)" : "var(--color-runtime-ink-soft)";
  const line = paper ? "var(--paper-line)" : "var(--color-runtime-line)";
  const signal = paper ? "var(--paper-accent)" : "var(--color-signal)";
  const warm = paper ? "#a8660b" : "#ff7050";
  const cool = paper ? "#1e8a7a" : "#5fd9f5";
  const fillUs = paper ? "rgba(128,56,232,0.07)" : "rgba(151,71,255,0.14)";

  const shell: React.CSSProperties = paper
    ? { borderRadius: "10px", border: `1px solid ${line}`, background: "var(--paper-card)" }
    : { borderRadius: "25px 55px 55px 5px", border: `1px solid ${line}`, background: "rgba(23,16,41,0.45)" };

  return (
    <figure className="m-0 overflow-hidden px-5 py-6 sm:px-7" style={shell}>
      <div className="overflow-x-auto pb-1">
        <svg
          viewBox="0 0 1000 300"
          role="img"
          aria-label="Схема: при A-book сделка проходит сквозь брокера к поставщику ликвидности и брокеру достаётся наценка; при B-book сделка остаётся у брокера и результат клиента становится его прибылью или убытком; гибрид сортирует поток между двумя схемами"
          className="block h-auto w-full min-w-[760px]"
        >
          <defs>
            <marker id="bb-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={soft} />
            </marker>
          </defs>

          <text x="0" y="16" fill={soft} fontSize="11" letterSpacing="1.4">A-BOOK · БРОКЕР ПОСЕРЕДИНЕ</text>
          <text x="530" y="16" fill={soft} fontSize="11" letterSpacing="1.4">B-BOOK · БРОКЕР КОНТРАГЕНТ</text>
          <line x1="495" y1="6" x2="495" y2="200" stroke={line} strokeDasharray="3 4" />

          {/* --- A-book --- */}
          <rect x="0" y="56" width="118" height="46" rx="23" fill="none" stroke={soft} strokeWidth="1.2" />
          <rect x="168" y="56" width="128" height="46" rx="6" fill={fillUs} stroke={signal} strokeWidth="1.2" />
          <rect x="346" y="56" width="128" height="46" rx="6" fill="none" stroke={soft} strokeWidth="1" strokeDasharray="3 3" />
          <text x="59" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Клиент</text>
          <text x="232" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Брокер</text>
          <text x="410" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Ликвидность</text>
          <line x1="122" y1="72" x2="164" y2="72" stroke={soft} strokeWidth="1.2" markerEnd="url(#bb-arw)" />
          <line x1="300" y1="72" x2="342" y2="72" stroke={soft} strokeWidth="1.2" markerEnd="url(#bb-arw)" />
          <text x="143" y="64" fill={soft} fontSize="10.5" textAnchor="middle">сделка</text>
          <text x="321" y="64" fill={soft} fontSize="10.5" textAnchor="middle">та же</text>
          <polyline points="410,102 410,126 59,126 59,106" fill="none" stroke={cool} strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#bb-arw)" />
          <text x="234" y="142" fill={soft} fontSize="10.5" textAnchor="middle">результат проходит насквозь — у брокера остаётся наценка</text>
          <text x="0" y="172" fill={soft} fontSize="11.5">клиент +300 $ → брокер +10 $</text>
          <text x="0" y="192" fill={soft} fontSize="11.5">клиент −300 $ → брокер +10 $</text>

          {/* --- B-book --- */}
          <rect x="530" y="56" width="118" height="46" rx="23" fill="none" stroke={soft} strokeWidth="1.2" />
          <rect x="698" y="56" width="128" height="46" rx="6" fill={fillUs} stroke={signal} strokeWidth="1.2" />
          <rect x="876" y="56" width="118" height="46" rx="6" fill="none" stroke={soft} strokeWidth="1" strokeDasharray="3 3" />
          <text x="589" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Клиент</text>
          <text x="762" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Брокер</text>
          <text x="935" y="84" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Рынок</text>
          <line x1="652" y1="72" x2="694" y2="72" stroke={soft} strokeWidth="1.2" markerEnd="url(#bb-arw)" />
          <text x="673" y="64" fill={soft} fontSize="10.5" textAnchor="middle">сделка</text>
          <line x1="830" y1="79" x2="872" y2="79" stroke={line} strokeWidth="1" strokeDasharray="3 3" />
          <line x1="845" y1="73" x2="857" y2="85" stroke={warm} strokeWidth="1.8" />
          <line x1="857" y1="73" x2="845" y2="85" stroke={warm} strokeWidth="1.8" />
          <text x="851" y="64" fill={soft} fontSize="10.5" textAnchor="middle">не выводится</text>
          <polyline points="762,102 762,126 589,126 589,106" fill="none" stroke={warm} strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#bb-arw)" />
          <text x="764" y="142" fill={soft} fontSize="10.5" textAnchor="middle">результат остаётся внутри — и играет против брокера</text>
          <text x="530" y="172" fill={soft} fontSize="11.5">клиент +300 $ → брокер −290 $</text>
          <text x="530" y="192" fill={soft} fontSize="11.5">клиент −300 $ → брокер +310 $</text>

          {/* --- гибрид --- */}
          <rect x="315" y="228" width="370" height="50" rx="8" fill={fillUs} stroke={signal} strokeWidth="1.2" />
          <text x="500" y="250" fill={ink} fontSize="14" fontWeight="600" textAnchor="middle">Гибрид: классификатор решает</text>
          <text x="500" y="268" fill={soft} fontSize="11" textAnchor="middle">по каждому клиенту, куда идёт его поток</text>
          <line x1="311" y1="253" x2="232" y2="253" stroke={soft} strokeWidth="1.2" markerEnd="url(#bb-arw)" />
          <line x1="689" y1="253" x2="768" y2="253" stroke={soft} strokeWidth="1.2" markerEnd="url(#bb-arw)" />
          <text x="228" y="245" fill={soft} fontSize="10.5" textAnchor="end">опасный поток — на рынок</text>
          <text x="772" y="245" fill={soft} fontSize="10.5">обычный поток — внутрь</text>
        </svg>
      </div>
      <figcaption className="mt-4 border-t pt-3 text-[0.9rem]" style={{ borderColor: line, color: soft }}>
        Единственная разница между моделями — идёт ли сделка дальше брокера. Слева результат
        клиента брокеру безразличен, справа становится его прибылью или убытком. Гибрид не
        выбирает одно из двух: он сортирует поток клиент за клиентом.
      </figcaption>
    </figure>
  );
}
