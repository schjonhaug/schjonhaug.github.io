---
layout: post
title: "Bitcoin er tid"
description: "Tid er penger, som det heter. Det følger dermed at penger også er tid: en representasjon av den kollektive økonomiske energien lagret av menneskeheten. Koblingen mellom tid og penger er imidlertid mer intrikat enn det kan se ut til å begynne med. Hvis penger ikke krever tid å skapes, fungerer det ikke som penger særlig godt, eller ikke lenge. Mer dyptgripende, som vi skal se, innebærer det å holde styr på ting i informasjonsverdenen alltid det å holde styr på tiden."
image: "/assets/bitcoin-is-time.jpg"
date: 2021-11-14 13:37:00 +0200
categories: bitcoin
---

![Bitcoin er tid](/assets/bitcoin-is-time.jpg)

av [Gigi](https://dergigi.com/2021/01/14/bitcoin-is-time/)

> En lysende klokke mot himmelen  
Proklamerte at tiden verken var feil eller riktig.

– Robert Frost, _Kjent med natten_ (1928)

> Tiden er fortsatt et stort mysterium for oss. Det er ikke mer enn et konsept; vi vet ikke om det eksisterer i det hele tatt…

– Clifford D. Simak, _Shakespeare’s Planet_ (1976)

Tid er penger, som det heter. Det følger dermed at penger også er tid: en representasjon av den kollektive økonomiske energien lagret av menneskeheten. Koblingen mellom tid og penger er imidlertid mer intrikat enn det kan se ut til å begynne med. Hvis penger ikke krever tid å skapes, fungerer det ikke som penger særlig godt, eller ikke lenge. Mer dyptgripende, som vi skal se, innebærer det å holde styr på ting i informasjonsverdenen alltid det å holde styr på tiden.

Så snart penger blir digitale, må vi bli enige om en _definisjon av tid_, og her ligger hele problemet. Du tror kanskje at det å fortelle klokkeslettet er like enkelt som å se på hvilken som helst klokke som er i nærheten, og du vil ha rett når det kommer til dagligdagse gjøremål. Men når det gjelder å synkronisere tilstanden til et globalt, motstridende, distribuert nettverk, blir det å fortelle tiden et nesten uløselig problem. Hvordan vet du hva klokken er hvis klokker ikke kan stoles på? Hvordan skaper du konseptet om en enestående tid hvis systemet ditt spenner over galaksen? Hvordan måler du tid i et tidløst område? Og hva er tid egentlig?

For å svare på disse spørsmålene må vi se nærmere på selve begrepet tid og hvordan Bitcoin finner opp sin egen tid: blokktid - mer kjent som _blokkhøyde_. Vi skal utforske hvorfor problemet med tidtaking er nært knyttet til å føre journaler, hvorfor det ikke finnes absolutt tid i et desentralisert system, og hvordan Bitcoin bruker kausalitet og uforutsigbarhet for å bygge sin egen oppfatning av nåtid.

Tidtakingsenheter har forvandlet sivilisasjoner mer enn én gang. Som Lewis Mumford påpekte i 1934: «Klokken, ikke dampmaskinen, er selve nøkkelmaskinen til den moderne industrielle tidsalder.» I dag er det igjen en tidtakingsenhet som forvandler sivilisasjonen vår: en klokke, ikke datamaskiner, er den sanne nøkkelmaskinen i den moderne informasjonsalderen. Og denne klokken er Bitcoin.

## Holde orden på ting

> La barnet lære å telle ting, og dermed få forestillingen om tall. Disse tingene blir, for tellingsformål, betraktet som like, og de kan være enkeltobjekter eller grupper.

– David Eugene Smith, _The Teaching of Elementary Mathematics_ (1900)

Svært generelt sett er det to måter å holde styr på ting på: fysiske polletter og hovedbøker. Du kan enten bruke virkelige gjenstander direkte, f.eks. gi noen et skjell, en mynt eller en annen håndgripelig _ting_, eller du kan replikere verdens tilstand ved å skrive ned hva som skjedde på et stykke papir.

Tenk deg at du er en gjeter som vil sørge for at hele flokken din kommer hjem. Du kan sette et halsbånd på hver sau, og så snart en sau kommer hjem, tar du bare av halsbåndet og henger det opp i skuret ditt. Hvis du har en knagg for hvert halsbånd, vil du vite at hver sau kommer trygt tilbake så snart alle knagge er fylt. Du kan selvfølgelig også telle dem og føre en liste. Du må imidlertid sørge for å lage en ny liste hver gang du begynner å telle, og du må også passe på å ikke telle en eneste sau to ganger (eller ikke i det hele tatt).

Penger er i hovedsak et verktøy for å holde styr på hvem som skylder hva til hvem. Stort sett faller alt vi har brukt som penger til nå i to kategorier: _fysiske gjenstander_ og _informasjonslister_. Eller, for å bruke mer vanlig språkbruk: polletter og hovedbøker.

![Ledger og token](/assets/ledger-token.jpg)

Det er viktig å innse den iboende forskjellen mellom disse kategoriene, så la meg påpeke det eksplisitt: Den første metoden – et fysisk symbol – representerer _direkte_ tingenes tilstand. Den andre - en hovedbok - gjenspeiler _indirekte_ tingenes tilstand. Hver kommer med fordeler og ulemper. For eksempel er polletter fysiske og distribuerte; hovedbøker er informative og sentraliserte. Polletters er iboende tillitsløse; hovedbøker er det ikke.

I den digitale verdenen – uansett hvor intenst markedsføringsguruer prøver å overbevise deg om det motsatte – kan vi bare bruke hovedbøker. Det er en _informasjonsverden_, ikke et fysisk en. Selv om du kaller en viss type informasjon en «pollett, er det fortsatt formbar informasjon, skrevet ned på en harddisk eller et annet medium som kan inneholde informasjon, som effektivt gjør den til en informasjonsoppføring.

Den hovedboklignende naturen til all digital informasjon er hovedårsaken til problemet med dobbeltbruk. Informasjon representerer aldri verdens tilstand _direkte_. Videre innebærer flytting av informasjon kopiering. Informasjon finnes på ett sted, og for å «flytte» den, må du kopiere den til et annet sted og slette den ved opprinnelsen. Dette problemet eksisterer ikke i den fysiske verdenen. I den fysiske verdenen kan vi faktisk flytte ting fra A til B. Informasjonsverdenen har ikke denne egenskapen. Hvis du vil «flytte» informasjon fra liste A til liste B, må du kopiere den fra A til B. Det finnes ingen annen måte.

En annen måte å tenke på er i form av unikhet. Fysiske polletter er unike sammensetninger av atomer hvis sammensetning ikke lett kan replikeres. Ren informasjon har ikke denne egenskapen. Hvis du kan lese informasjonen, kan du også kopiere den perfekt. Praktisk talt følger det at fysiske polletter er unike, og digitale polletter er ikke det. Jeg vil til og med hevde at «digital pollett» er en feilbetegnelse. En pollett kan representere hemmelig informasjon, men det vil aldri representere unik, enkeltstående, ukopierbar informasjon.

Denne forskjellen i egenskaper viser at det virkelig ikke er noen måte å «overlevere» informasjon på. Det er umulig å gi videre en digital pollett slik du ville gitt videre en fysisk, siden du aldri kan være sikker på om den opprinnelige eieren ødela informasjonen på sin side. Digitale polletter, som all informasjon, kan bare spres, som en idé.

> … hvis du har et eple og jeg har et eple, og vi bytter epler — ender vi hver opp med bare ett eple. Men hvis du og jeg har en idé og vi bytter ideer — ender vi opp med to ideer hver.

– Charles F. Brannan (1949)

Fysiske polletter – det vi kaller fysiske bærermidler, eller «kontanter» – går fri av dette dilemmaet. I den virkelige verden, hvis du gir meg en mynt, så er mynten din borte. Det er ingen magisk duplikasjon av mynten, og den eneste måten å gi den til meg på er å overlevere den fysisk. Fysikkens lover tillater ikke at du dobbeltbruker det.

Mens dobbeltbruk eksisterer i den ikke-digitale verdenen - George Parker, en bedrager som så berømt «dobbelt-brukte» Brooklyn Bridge og andre landemerker kommer til tankene - krever det omfattende lureri og godtroende kjøpere. Slik er det ikke i den digitale verdenen.

I den digitale verdenen, fordi vi alltid har med _informasjon_ å gjøre, er dobbeltbruk et _iboende_ problem. Som alle som noen gang har kopiert en fil eller brukt klipp-og-lim vet, er informasjon noe du kan kopiere _perfekt_, og det er ikke bundet til mediet som er vert for det. Hvis du for eksempel har et digitalt fotografi, kan du kopiere den en million ganger, lagre noen kopier på en USB-pinne og sende den til tusenvis av forskjellige personer. Perfekte kopier er mulig fordi informasjon gir mulighet for feilfri feilretting, noe som eliminerer forringelse. Og for å toppe det hele, er det praktisk talt ingen kostnader for duplisering og ingen måte å avgjøre hvilket som var originalen.

Igjen: når det gjelder informasjon, er kopiering alt som finnes. Det er rett og slett ingen måte å _flytte_ digital informasjon fra A til B. Informasjon _kopieres_ alltid fra A til B, og hvis kopieringsprosessen var vellykket, slettes den originale kopien av A. Dette er grunnen til at problemet med dobbeltbruk er så vanskelig. Fravær av en sentral myndighet er det ingen måte å flytte _noe som helst_ fra A til B på en tillitsløs måte. Du må alltid stole på at originalen blir slettet. En naturlig bieffekt er at når det gjelder digital informasjon, er det _umulig_ å si hvor mange eksemplarer som finnes og hvor disse kopiene kan befinne seg.

På grunn av dette kan og vil aldri bruk av digitale «polletter» som penger fungere. Siden polletter henter sin pålitelighet fra å være vanskelige å reprodusere som et resultat av deres unike fysiske konstruksjon, forsvinner denne fordelen i den digitale verdenen. I den digitale verdenen kan ikke polletter stoles på. Som et resultat av naturen til informasjonens iboende egenskaper, er det eneste levedyktige formatet for digitale penger ikke en pollett, men en hovedbok - som bringer oss til problemet med tid.

## Polletter er tidløse, hovedbøker er ikke

> For det synlige varer en kort stund, men det usynlige er evig.

– Paulus av Tarsus, _Korinterbrev_ 4:18b

Når det gjelder fysiske polletter, spiller ikke tidspunktet for en transaksjon noen rolle. Enten har du myntene i lommen, eller så har du ikke; du kan enten bruke dem, eller så kan du ikke det. Den enkle besittelseshandlingen er den eneste forutsetningen for å bruke pollettene. Naturlovene tar seg av resten. I den forstand er fysiske polletter tillitsløse og tidløse.

Når det gjelder hovedbøker, faller fysisk besittelse til siden. Den som har kontroll over hovedboken må sørge for at ting er _i riktig rekkefølge_. Det som ellers er gitt av fysiske lover, nemlig at du ikke kan bruke penger du ikke har, og du ikke kan bruke penger som du allerede har blitt brukt tidligere, må håndheves av menneskeskapte regler. Det er disse reglene som styrer ryddig drift og vedlikehold av en hovedbok, ikke fysiske lover.

Å gå fra fysiske lover til menneskeskapte regler er sakens kjerne. Menneskeskapte regler kan bøyes og brytes, fysiske lover ikke fullt så mye. For eksempel kan du ikke bare «finne opp» en fysisk gullmynt. Du må grave den ut av bakken. Du kan imidlertid absolutt lage en gullmynt på papir. For å gjøre dette legger du bare til en oppføring i hovedboken og gir deg selv et par mynter. Eller, når det gjelder sentralbanker, legg til et par billioner med noen få tastetrykk på datamaskinen. (Fancy finansfolk kaller dette «rehypotekering», «fraksjonell reservebank» eller «kvantitativ lettelse» - men ikke la deg lure, det er det samme: å finne opp penger.)

For å holde hovedbøker og de som håndterer dem ærlige, kreves regelmessige, uavhengige revisjoner. Muligheten til å gjøre rede for hver enkelt oppføring i en hovedbok er ikke en luksus. Revisorer må kunne gå gjennom bøkene – bakover i tid – for å holde hovedboken ærlig og fungerende. Uten pålitelige tidsstempler er det umulig å verifisere den interne konsistensen til en hovedbok. En mekanisme for å etablere en entydig rekkefølge er avgjørende.

Uten en absolutt oppfatning av tid, er det ingen måte å ha en definert rekkefølge for transaksjoner. Og uten en definert rekkefølge av transaksjoner, kan reglene for en hovedbok ikke følges. Hvordan ellers kan du være sikker på hvor mye penger du faktisk har? Hvordan kan du ellers sørge for at ting er i riktig rekkefølge?

Skillet mellom polletter og hovedbøker fremhever nødvendigheten av å holde styr på tiden. I den fysiske verdenen er mynter tidløse gjenstander som kan byttes uten tilsyn. I den digitale verdenen krever myntstempling tidsstempling.

## Sentralisert myntstempling

> Tid: en flott gravør, eller viskelær.

– Yahia Lababidi (f. 1973)

Den vanlige måten å løse problemet med dobbeltbruk - problemet med å sørge for at en digital overføring bare skjer én gang - er å ha en sentral liste over transaksjoner. Når du har en sentral liste over transaksjoner, har du en enkel hovedbok som kan fungere som den eneste kilden til sannhet. Å løse problemet med dobbeltbruk er like enkelt som å gå gjennom listen og sørge for at alt stemmer. Dette er hvordan PayPal, Venmo, Alipay og alle bankene i denne verden - inkludert sentralbanker - løser problemet med dobbeltbruk: via sentral myndighet.

> Problemet er selvfølgelig at betalingsmottakeren ikke kan bekrefte at en av eierne ikke dobbeltbrukte mynten. En vanlig løsning er å introdusere en pålitelig sentral myndighet, eller myntverk, som sjekker hver transaksjon for dobbeltbruk. […] Problemet med denne løsningen er at skjebnen til hele pengesystemet avhenger av selskapet som driver myntverket, og hver transaksjon må gå gjennom dem, akkurat som en bank.

– Satoshi Nakamoto (2009)

Det er verdt å påpeke at Satoshi ikke klarte å gjøre informasjon ikke-kopierbar. Hver del av bitcoin - kildekoden, hovedboken, din private nøkkel - kan kopieres. Alt kan dupliseres og tukle med. Satoshi klarte imidlertid å bygge et system som gjør regelbrytende kopier fullstendig ubrukelige. Bitcoin-nettverket utfører en intrikat dans for å bestemme hvilke kopier som er nyttige og hvilke som ikke er det, og det er denne dansen som bringer knapphet inn i den digitale verdenen. Og som med enhver dans, kreves det en tidsmessig målestokk for å diktere rytmen.

Selv en sentralisert hovedbok kan bare løse problemet med dobbeltbruk hvis den har en konsekvent måte å holde oversikt over tid på. Du må alltid vite hvem som ga hvor mye til hvem og, viktigst av alt: _når_. I informasjonsverdenen er det ingen myntstempling uten tidsstempling.

> Det må understrekes at _umuligheten av å assosiere hendelser med tidspunkter_ i distribuerte systemer var det uløste problemet som hindret en desentralisert hovedbok fra å være mulig før Satoshi Nakamoto fant opp en løsning.

Gregory Trubetskoy (2018)

## Desentralisert tid

> Tiden får alle ting til å gå over.

– [Aischylos](https://no.wikipedia.org/wiki/Aiskhylos) (525 f.Kr. – 456 f.Kr.)

Tid og rekkefølge har et veldig intimt forhold. Som Leslie Lamport påpekte i sin artikkel fra 1978 _Time, Clocks, and the Ordering of Events in a Distributed System_: «Begrepet tid er grunnleggende for vår måte å tenke på. Det er avledet fra det mer grunnleggende konseptet om rekkefølgen hendelser inntreffer.» Fraværende et sentralt punkt for koordinering, brytes tilsynelatende intuitive forestillinger om «før», «etter» og «samtidig» sammen. Med Lamports ord: «begrepet ‘å skje før’ definerer en invariant delvis rekkefølge av hendelsene i et distribuert multiprosessystem.»

Formulert på en annen måte: Hvem skal ha ansvaret for tiden hvis det ikke er lov å sette noen til å styre? Hvordan kan du ha en pålitelig klokke hvis det ikke er noen sentral referanseramme?

Du tror kanskje at det er enkelt å løse dette problemet fordi alle bare kan bruke sin egen klokke. Dette fungerer bare hvis hver enkelt klokke er nøyaktig, og enda viktigere, alle følger reglene. I et motstridende system ville det være en katastrofe å stole på individuelle klokker. Og på grunn av relativitet fungerer det ikke konsekvent på tvers av rommet.

Som et tankeeksperiment, forestill deg hvordan du kunne jukse systemet hvis alle hadde ansvaret for å holde tiden for seg selv. Du kan late som om transaksjonen du sender nå faktisk er fra i går – den ble bare forsinket av en eller annen grunn – og dermed ville du fortsatt ha alle pengene du har brukt i dag. På grunn av den asynkrone kommunikasjonen som er iboende i ethvert desentralisert system, er dette scenariet mer enn et teoretisk tankeeksperiment. Meldinger blir faktisk forsinket, tidsstempler er unøyaktige, og takket være relativistiske effekter og den naturlige fartsgrensen til universet vårt, er det alt annet enn enkelt å skille rekkefølgen på ting som mangler en sentral autoritet eller observatør.

> Hvem er der? Bank bank.

En asynkron spøk

For bedre å illustrere problemets umulighet, la oss se på et konkret eksempel. Tenk deg at du og din forretningspartner begge har tilgang til firmaets bankkonto. Dere driver forretninger over hele verden, så bankkontoen deres er i Sveits, du er i New York, og forretningspartneren din er i Sydney. For deg er det 3. januar, og du nyter en vakker søndagskveld på hotellet ditt. For henne er det allerede mandag morgen, så hun bestemmer seg for å kjøpe frokost med debetkortet til deres delte bankkonto. Prisen er 27 $. Den tilgjengelige saldoen er 615 $. Lokal tid er 08:21.

Samtidig er du i ferd med å betale for oppholdet med et annet debetkort knyttet til samme bankkonto. Prisen er 599 $. Den tilgjengelige saldoen er 615 $. Lokal tid er 17:21.

![Alice Bob Bank](/assets/alice-bob-bank.jpg)

Så faller det seg slik at - i nøyaktig samme øyeblikk - sveiper dere begge kortet. Hva skjer? (Kjære fysikere, unnskyld min bruk av «det samme øyeblikk» – vi ignorerer relativistiske effekter og det faktum at det ikke er noen absolutt tid i universet vårt for nå. Vi ignorerer også  at konseptet med synkrone hendelser egentlig ikke eksisterer. Bitcoin er komplisert nok som det er!)

Hovedboken i banken din vil sannsynligvis motta en transaksjon før den andre, så en av dere vil være heldig, den andre ikke fullt så mye. Hvis transaksjonene tilfeldigvis kommer i samme _tikk_ - la oss si i samme millisekund - må banken bestemme hvem som får bruke pengene.

Nå, hva ville skje hvis det ikke var noen bank? Hvem bestemmer hvem som var den første til å sveipe? Hva om det ikke bare var dere to, men hundrevis eller til og med tusenvis av mennesker som skulle koordinere dette? Hva om du ikke stolte på disse menneskene? Hva om noen av disse menneskene prøver å jukse, for eksempel ved å stille klokken tilbake slik at det ser ut som de brukte pengene et par minutter tidligere?

> Et tidsrelatert verktøy [er] nødvendig for å etablere en kanonisk orden og for å håndheve en unik historie i fravær av noen sentral koordinator.

– Giacomo Zucco, [_Discovering Bitcoin_](https://bitcoinmagazine.com/articles/discovering-bitcoin-a-brief-overview-from-cavemen-to-the-lightning-network) (2019)

Dette problemet er _nettopp_ grunnen til at alle tidligere forsøk på digitale kontanter krevde et sentralisert register. Du måtte alltid stole på noen for å identifisere tingenes rekkefølge. Et sentralisert parti var påkrevd for å holde tiden.

Bitcoin løser dette problemet ved å finne opp selve tiden på nytt. Den sier nei til sekunder og ja til blokker.

## Holde tiden, en blokk om gangen

> Tidens ære er å berolige stridende konger,
å avsløre falskhet og bringe sannhet frem i lyset,
å stemple tidens segl i gamle ting, å vekke morgenen og vaktposten om natten, å urett den urettferdige til han gjør rett;

William Shakespeare, _The Rape of Lucrece_ (1594)

Alle klokker er avhengige av periodiske prosesser, noe vi kan kalle et «tikk». Den velkjente _tikk-takken_ til en bestefarsklokke er i hovedsak det samme som den molekylæratomiske summingen til våre moderne kvarts- og cesiumklokker. Noe svinger - eller oscillerer - og vi teller ganske enkelt disse svingningene til det blir et minutt eller et sekund.

For store pendelklokker er disse svingene lange og lette å se. For mindre og mer spesialiserte klokker kreves spesialutstyr. Frekvensen til en klokke - hvor ofte den tikker - avhenger av bruksområdet.

De fleste klokker har en fast frekvens. Tross alt vil vi vite klokkeslettet _nøyaktig_. Det finnes imidlertid klokker som har en variabel frekvens. En metronom har for eksempel en variabel frekvens som du kan stille inn før du får den til å tikke. Mens en metronom holder tempoet konstant når den er satt, varierer Bitcoins tid for hvert tikk fordi dens interne mekanisme er probabilistisk. Hensikten er imidlertid den samme: holde musikken i live, så dansen kan fortsette.

|           Klokke          |             Tikkefrekvens              |
|:-------------------------:|:--------------------------------------:|
| Bestefarsklokke           | ~0,5 Hz                                |
| Metronom                  | ~0,67 Hz til ~4,67 Hz                  |
| Kvartsur                  | 32 768 Hz                              |
| Cesium-133 atomisk klokke | 9 192 631 770 Hz                       |
| Bitcoin                   | 1 blokk (0,00000192901 Hz* til ∞ Hz**) |

\* første blokk (6 dager)

\*\* tidsstempler mellom blokker kan vise et negativt delta

Det faktum at Bitcoin er en klokke skjuler seg rett foran nesen på en. Faktisk påpeker Satoshi at Bitcoin-nettverket som helhet fungerer som en klokke, eller, med hans ord: en distribuert tidsstempelserver.

> I denne artikkelen foreslår vi en løsning på problemet med dobbeltbruk ved å bruke en peer-to-peer-distribuert tidsstempelserver for å generere beregningsbevis for den kronologiske rekkefølgen av transaksjoner.

– Satoshi Nakamoto (2009)

At tidsstempling var hovedproblemet som skulle løses, er også tydelig ved å undersøke referansen på slutten av Bitcoin whitepaper. Av de totalt åtte referansene handler tre om tidsstempling:

* _Hvordan tidsstemple et digitalt dokument_ av S. Haber, W. S. Stornetta (1991)
* _Forbedring av effektiviteten og påliteligheten til digital tidsstempling_ av D. Bayer, S. Haber, W. S. Stornetta (1992)
* _Design av en sikker tidsstemplingstjeneste med minimale tillitskrav_ av H. Massias, X. S. Avila og J.-J. Quisquater (mai 1999)

Som Haber og Stornetta skisserte i 1991, handler digital tidsstempling om beregningsmessige praktiske prosedyrer som gjør det umulig for en bruker – eller en motstander, for den saks skyld – å enten tilbake- eller fremoverdatere et digitalt dokument. I motsetning til fysiske dokumenter, er digitale dokumenter enkle å tukle med, og endringen etterlater ikke nødvendigvis noen avslørende tegn på selve det fysiske mediet. I den digitale verdenen kan forfalskninger og manipulasjoner være perfekte.

Informasjonens formbare natur gjør tidsstempling av digitale dokumenter til en forseggjort og sofistikert prosess. Naive løsninger fungerer ikke. Ta for eksempel et tekstdokument. Du kan ikke bare legge til datoen på slutten av dokumentet siden alle – inkludert deg selv – ganske enkelt kan endre datoen i fremtiden. Du kan også finne på hvilken som helst dato i utgangspunktet.

## Tid er en kausal kjede

> I et ekstremt syn kan verden sees som bare forbindelser, ingenting annet.

– Tim Berners-Lee, _Weaving the Web_ (1999)

Å finne på datoer er et generelt problem, selv i den ikke-digitale verdenen. Det som i kidnappingsverdenen er kjent som «autentisering med avis» er en generell løsning på problemet med vilkårlige tidsstempler.

![Tidsbevis](/assets/proof-of-time.jpg)

Dette fungerer fordi en avis er vanskelig å forfalske og lett å verifisere. Den er vanskelig å forfalske fordi dagens forside viser til gårsdagens hendelser, hendelser som ikke kunne vært forutsett av kidnapperen hvis bildet ville vært flere uker gammelt. Indirekte av disse hendelsene er bildet et bevis på at gisselet fortsatt var i live den dagen avisen kom ut.

Denne metoden fremhever et av nøkkelbegrepene når det kommer til tid: _kausalitet_. Tidens pil beskriver årsakssammenhengen mellom hendelser. Ingen årsakssammenheng, ingen tid. Kausalitet er også grunnen til at kryptografiske hashfunksjoner er så avgjørende når det kommer til tidsstempling av dokumenter i cyberspace: de introduserer en årsakssammenheng. Siden det praktisk talt er umulig å lage en gyldig kryptografisk hash uten å ha dokumentet i utgangspunktet, introduseres en årsakssammenheng mellom dokumentet og hashen: de aktuelle dataene eksisterte først, hashen ble generert senere. Med andre ord: uten den beregningsmessige irreversibiliteten til enveisfunksjoner, ville det ikke vært noen kausalitet i cyberspace.

![A før B](/assets/sha256.jpg)

Med denne årsaksbyggesteinen på plass, kan man komme opp med ordninger som skaper en kjede av hendelser, som kausalt knytter A til B til C og så videre. Slik sett flytter sikker digital tidsstempling oss fra et tidløst sted i eteren til den digitale historiens verden.

> Kausalitet fikser hendelser i tid. Hvis en hendelse ble bestemt av visse tidligere hendelser, og bestemmer visse påfølgende hendelser, er hendelsen klemt sikkert inn på sin plass i historien.

– Bayer, Haber, Stornetta (1992)

Det sier seg selv at årsakssammenheng er av største betydning når det gjelder økonomiske beregninger. Og siden en hovedbok ikke er annet enn legemliggjørelsen av økonomiske beregninger av flere samarbeidende deltakere, er årsakssammenheng avgjørende for hver hovedbok.

> Vi trenger et system for deltakere til å bli enige om en enkelt historie […]. Løsningen vi foreslår begynner med en tidsstempelserver.

– Satoshi Nakamoto (2009)

Det er fascinerende at alle puslespillbrikkene som får Bitcoin til å fungere allerede eksisterte. Så tidlig som i 1991 introduserte Haber og Stornetta to ordninger som gjør det «vanskelig eller umulig å produsere falske tidsstempler». Den første er avhengig av en pålitelig tredjepart; den andre, mer forseggjorte «distribuert tillit»-ordningen, gjør det ikke. Forfatterne identifiserte til og med de iboende problemene med å stole på en kausal kjede av hendelser og hva som ville være nødvendig for å omskrive historien. Med deres egne ord, «den eneste mulige forfalskningen er å forberede en falsk kjede med tidsstempler, lang nok til å slite ut den mest mistenkelige utfordreren som man forventer.» En lignende angrepsvektor finnes i Bitcoin i dag, i form av et 51% angrep (mer om det i et senere kapittel).

Ett år senere bygde Bayer, Haber og Stornetta på sitt tidligere arbeid og foreslo å bruke trær i stedet for enkle lenkede lister for å knytte hendelser sammen. Det vi i dag kjenner som Merkle Trees er rett og slett effektive datastrukturer for å lage en hash fra flere hasher deterministisk. For tidsstempling betyr dette at du effektivt kan samle flere hendelser i et «tikk». I det samme papiret foreslår forfatterne at den distribuerte tillitsmodellen som ble introdusert i 1991 kan forbedres ved å gjennomføre en gjentakende «verdensmesterskapsturnering» for å avgjøre en enkelt «vinner» som publiserer den resulterende hashen bredt et sted offentlig, som i en avis. Høres kjent ut?

Som vi skal se, viser det seg at aviser også er en utmerket måte å tenke på tidens andre ingrediens: uforutsigbarhet.

## Kausalitet og uforutsigbarhet

> Tid er ikke en realitet [hupostasis], men et konsept [noêma] eller et mål [metron]…

– Sofisten Antiphon, _On Truth_ (3. århundre e.Kr.)

Selv om årsakssammenheng er vesentlig, er det ikke tilstrekkelig. Vi trenger også _uforutsigbarhet_ for at tiden skal flyte. I den fysiske verdenen observerer vi naturlige prosesser for å beskrive strømmen av tid. Vi observerer en generell økning i entropi og kaller det tidens pil. Selv om naturlovene ser ut til å være uvitende med hensyn til retningen til denne pilen i de fleste tilfeller, kan visse ting praktisk talt ikke omgjøres. Du kan ikke gå fra eggerøre til egg, for å si det sånn.

På samme måte kreves det entropiøkende funksjoner for å etablere en tidspil i den digitale verdenen. Akkurat som det er praktisk talt umulig å gå fra eggerøre til egg, er det praktisk talt umulig å dekryptere en SHA256-hash eller kryptografisk signatur.

Uten denne økningen i entropi, kunne vi gå fremover og bakover i tid med vilje. Rekkefølgen av Fibonacci-tall, for eksempel, er kausal, men ikke entropisk. Hvert tall i sekvensen er forårsaket av de to tallene som kom før det. Sånn sett er det en årsakskjede. Det kan imidlertid ikke benyttes til å fortelle tiden fordi den er helt forutsigbar. På samme måte som en kidnapper ikke bare kan stå foran en kalender som viser gjeldende dato, kan vi ikke bruke forutsigbare prosesser som bevis på tid. Vi må alltid stole på noe som ikke kan forutses på forhånd, som forsiden av dagens avis.

Bitcoin er avhengig av to kilder til uforutsigbarhet: transaksjoner og bevis-på-arbeid. Akkurat som ingen kan forutsi hvordan morgendagens avis vil se ut, kan ingen forutsi hvordan neste Bitcoin-blokk vil se ut. Du kan ikke forutsi hvilke transaksjoner som kommer til å bli inkludert fordi du ikke kan forutsi hvilke transaksjoner som skal kringkastes i fremtiden. Og enda viktigere, du kan ikke forutsi hvem som vil finne løsningen på det gjeldende bevis-på-arbeid-puslespillet og hva denne løsningen vil være.

I motsetning til kidnapperens avis er bevis-på-arbeid imidlertid _direkte_ fysisk knyttet til det som skjedde. Det er ikke bare en oversikt over en hendelse – det er selve hendelsen. Det er den probabilistiske direktheten av bevis-på-arbeid som fjerner tillit fra ligningen. Den eneste måten å finne et gyldig bevis på arbeid er ved å gjøre mange gjetninger, og å gjøre en enkelt gjetning tar litt tid. Den probabilistiske summen av disse gjetningene er det som bygger opp tidskjeden som er Bitcoin.

Ved å utnytte årsakssammenhengen til hashkjeder og uforutsigbarheten til bevis-på-arbeid, gir Bitcoin-nettverket en mekanisme for å etablere en udiskutabel historie med hendelser som fant sted. Uten kausalitet er det som kom før og det som kom etter umulig å lirke fra hverandre. Uten uforutsigbarhet er kausalitet meningsløs.

Hva som intuitivt forstås av hver kidnapper ble eksplisitt påpekt av Bayer, Haber og Stornetta i 1992: «For å fastslå at et dokument ble opprettet etter et gitt øyeblikk i tid, er det nødvendig å rapportere hendelser som ikke kunne vært forutsett før de skjedde."

![Bevis for publisering](/assets/proof-of-publication.jpg)

Det er kombinasjonen av kausalitet og uforutsigbarhet som gjør det mulig å skape et kunstig «nå» i den ellers tidløse digitale verdenen. Som Bayer, Haber og Stornetta påpeker i deres artikkel fra 1991: «Rekkefølgen av klienter som ber om tidsstempler og hashen de sender inn kan ikke være kjent på forhånd. Så hvis vi inkluderer biter fra den forrige sekvensen av klientforespørsler i det signerte sertifikatet, så vet vi at tidsstemplet skjedde etter disse forespørslene. […] Men kravet om å inkludere biter fra tidligere dokumenter i sertifikatet kan også brukes til å løse problemet med å begrense tiden i den andre retningen, fordi tidsstemplingsfirmaet ikke kan utstede senere sertifikater med mindre det har den aktuelle forespørselen i hende."

Alle puslespillbrikkene var der allerede. Det Satoshi klarte å gjøre er å sette dem sammen på en måte som fjerner «tidsstemplingsselskapet» fra ligningen.

## Tidsbevis

> Causa latet: vis est notis sima.  
Årsaken er skjult, men resultatet er kjent.

– Ovid, _Metamorfoser_, IV. 287 (8 e.Kr.)

La oss oppsummere: For å bruke penger i den digitale verdenen, må vi stole på hovedbøker. For å gjøre hovedbøker pålitelige, kreves det entydig rekkefølge. For å etablere rekkefølge er tidsstempler nødvendig. Derfor, hvis vi ønsker å ha _tillitsløse_ penger i den digitale verdenen, må vi fjerne enhver enhet som lager og administrerer tidsstempler og enhver enkelt enhet som har ansvaret for selve tiden.

Det krevde et geni som Satoshi Nakamoto for å realisere løsningen: «For å implementere en distribuert tidsstempelserver på peer-to-peer-basis, må vi bruke et bevis-på-arbeid-system som ligner på Adam Backs Hashcash.»

Vi må bruke et bevis-på-arbeid-system fordi vi trenger noe som er hjemmehørende i den digitale verdenen. Når du først forstår at den digitale verdenen er informasjonsmessig, er den åpenbare konklusjonen at beregning er alt vi har. Hvis verdenen din er laget av data, er manipulering av data alt som finnes.

Bevis-på-arbeid fungerer i en peer-to-peer-setting fordi det er _tillitsløst_, og det er tillitsløst fordi det er koblet fra alle eksterne innganger - for eksempel avlesning av klokker (eller aviser, for den saks skyld). Den er avhengig av bare én ting og én ting alene: beregning krever arbeid, og i universet vårt krever arbeid energi og tid.

## Bridging Times

> Jeg vet det fungerer for meg.  
Når vi krysser broen — den brennende broen —  
Med flammer bak oss,  
vi fronter linjen.  
Det er du og meg, baby, mot verden.

– Kate Bush, Burning Bridge (1985)

Uten bevis-på-arbeid ville man alltid støtt på orakelproblemet fordi den fysiske verdenen og den informasjonsmessige verdenen er for alltid frakoblet. Markeringene på listen over sauer er ikke dine sauer, kartet er ikke territoriet, og det som ble skrevet i gårsdagens avis er ikke nødvendigvis det som skjedde i den virkelige verden. På samme måte, bare fordi du bruker en klokke fra den virkelige verden til å skrive ned et tidspunkt, betyr ikke det at dette faktisk er hva klokken var.

Sagt rett ut, det er ganske enkelt ingen måte å stole på at data representerer virkeligheten, bortsett fra hvis den aktuelle virkeligheten er iboende i selve dataene. Det geniale med Bitcoins vanskelighetsjusterte bevis-på-arbeid er at det skaper sin egen virkelighet, sammen med sitt eget rom og tid.

Bevis-på-arbeid gir en direkte forbindelse mellom den digitale verden og den fysiske verden. Mer dyptgående er det den eneste forbindelsen som kan etableres på en tillitsløs måte. Alt annet vil alltid være avhengig av eksterne innganger.

Vanskeligheten for å utvinne en ny Bitcoin-blokk er justert for å sikre at den tynne linjen mellom Bitcoins tid og vår tid forblir intakt. Som et urverk justeres vanskeligheten seg hvert 2016. tikk. Målet med denne omjusteringen er å holde _gjennomsnittlig_ tid mellom tikk på ti minutter. Det er disse ti minuttene som opprettholder en stabil forbindelse mellom den fysiske verdenen og informasjonsverdenen. Følgelig kreves en følelse av menneskelig tid for å justere tikkene på Bitcoin-klokken. En ren blokkbasert omjustering ville ikke fungere siden den ville være fullstendig frakoblet vår menneskelige verden, og hele hensikten med omjusteringen er å stoppe oss geniale mennesker fra å finne blokker for fort (eller for sakte).

Som Einstein har vist oss, er ikke tid en statisk ting. Det er ikke noe slikt som en universell tid vi kan stole på. Tid er relativ, og samtidighet er ikke-eksisterende. Dette faktum alene gjør alle tidsstempler – spesielt over store avstander – iboende upålitelige, selv uten motstridende aktører. (Dette er grunnen til at tidsstempler for GPS-satellitter må justeres konstant, forresten.)

For Bitcoin spiller det ikke så stor rolle at våre menneskelige tidsstempler er upresise. Det gjør heller ikke noe at vi i utgangspunktet ikke har noen absolutt referanseramme. De trenger bare å være nøyaktige nok til å beregne et noe pålitelig gjennomsnitt over 2016 blokker. For å garantere det, aksepteres en blokks «meatspace»-tidsstempel bare hvis den oppfyller to kriterier:

1. Tidsstemplet må være større enn mediantidsstemplet for de foregående 11 blokkene.
1. Tidsstemplet må være mindre enn den nettverksjusterte tiden pluss to timer. (Den «nettverksjusterte tiden» er ganske enkelt medianen av tidsstemplene som returneres av alle noder som er koblet til deg.)

Med andre ord handler vanskelighetsjusteringen om å holde en konstant tid, _ikke_ et konstant nivå av sikkerhet, vanskelighet eller energiforbruk. Dette er genialt fordi gode penger _må_ være kostbare i tid, ikke energi. Å knytte penger til energi alene er ikke tilstrekkelig for å produsere absolutt knapphet, siden hver forbedring i energiproduksjonen vil tillate oss å skape mer penger. Tid er det eneste vi aldri vil kunne skape mer av. Det er _The Ultimate Resource_, som Julian Simon påpeker. Dette gjør Bitcoin til den ultimate formen for penger fordi utstedelsen er direkte knyttet til universets ultimate ressurs: tid.

Vanskelighetsjusteringen er viktig fordi uten den ville den interne klokken til Bitcoin ha en tendens til å gå raskere og raskere ettersom flere minere slutter seg til nettverket eller effektiviteten til gruveutstyr forbedres. Vi ville raskt støte på koordineringsproblemet som Bitcoin forsøker å løse. Så snart blokkeringstiden faller under en viss terskel, for eksempel 50 millisekunder, ville det være umulig å bli enige om en delt tilstand, selv i teorien. Det tar lys rundt 66 millisekunder å reise fra den ene siden av jorden til den andre. Dermed, selv om datamaskinene og ruterne våre var perfekte, ville vi være tilbake på startpunktet: gitt to hendelser, ville det være nytteløst å fortelle hvilken hendelse som skjedde før og hvilken hendelse som skjedde etter. Uten en periodisk justering av Bitcoins tikker, ville vi havnet i det håpløse problemet med å løse koordinasjonsproblemet raskere enn lysets hastighet. Tid er også roten til problemet med kryptografisk ustabilitet, som ble skissert i kapittel 1. Kryptografi fungerer på grunn av en asymmetri i tid: det tar kort tid å bygge en kryptografisk vegg og lang tid å bryte den ned - med mindre du ha en nøkkel.

På en eller annen måte reduserer bevis-på-arbeid – og vanskelighetsjusteringen som følger med – tiden kunstig, i det minste sett fra Bitcoin-nettverkets perspektiv. Med andre ord: Bitcoin fremtvinger en intern rytme hvis lave frekvens tillater rikelig buffer for ventetiden til kommunikasjon mellom peers. Hver 2016. blokk justeres Bitcoins interne klokke, slik at - i gjennomsnitt - bare én gyldig blokk vil bli funnet hvert 10. minutt.

Fra et eksternt perspektiv fører Bitcoin det kaotiske rotet av globalt kringkastede asynkrone meldinger inn i et parallelt univers, begrenset av sine egne regler og sin egen følelse av rom og tid. Transaksjoner i mempoolen er tidløse fra Bitcoin-nettverkets synspunkt. Først når en transaksjon er inkludert i en gyldig blokk får den tildelt en tid: nummeret på blokken den er inkludert i.

![BitCoin v0.01 ALPHA (2009)](/assets/timechain.png)

Det er vanskelig å overvurdere hvor elegant løsning dette er. Når du er i stand til å lage din egen definisjon av tid, er det trivielt å tyde hva som kom før og hva som kom etter. Følgelig blir det trivielt å bli enige om hva som skjedde, i hvilken rekkefølge, og følgelig hvem som skylder hvem hva.

Vanskelighetsjusteringen sørger for at _tikkene_ på Bitcoins interne metronom er noe konstante. Det er dirigenten for Bitcoin-orkesteret. Det er det som holder musikken i live.

Men hvorfor kan vi stole på arbeid i utgangspunktet? Svaret er tredelt. Vi kan stole på det fordi beregning krever arbeid, arbeid krever tid, og det aktuelle arbeidet – å gjette tilfeldige tall – ikke kan gjøres effektivt.

## Probabilistisk tid

> Tidsgafler fortsetter mot utallige fremtider.

– Jorge Luis Borges, _The Garden of Forking Paths_ (1941)

Å finne en gyldig nonce for en Bitcoin-blokk er en gjettelek. Det ligner veldig på det å kaste en terning, gjøre et myntkast eller snurre et ruletthjul. Du prøver i hovedsak å finne et astronomisk stort tilfeldig tall. Det er ingen fremgang mot å finne en løsning. Enten får du jackpot, eller så gjør du det ikke.

Hver gang gjør et myntkast, er sjansen for at den lander på mynt eller krone 50% - selv om du har kastet tjue ganger før, og du fikk krone hver gang. På samme måte, hver gang du venter på at en bitcoin-blokk skal komme inn, er sjansen for at den blir funnet _i dette sekund_ ~0,16%. Det spiller ingen rolle når den siste blokken ble funnet. Den omtrentlige ventetiden for neste blokk er alltid den samme: ~10 minutter.

Det følger at hvert enkelt tikk på denne klokken er uforutsigbart. I forhold til våre menneskelige klokker ser denne klokken ut til å være spontan og upresis. Dette er irrelevant, som Gregory Trubetskoy påpeker: «Det spiller ingen rolle at denne klokken er upresis. Det som betyr noe er at det er den samme klokken for alle, og at tilstanden til kjeden kan knyttes utvetydig til tikkene på denne klokken.» Bitcoins klokke kan være probabilistisk, men den er ikke illusorisk.

> Tid er en illusjon,  
lunsjtid dobbelt så.

– Douglas Adams (1979)

Det nåværende øyeblikket kan imidlertid absolutt være en illusjon i Bitcoin. Siden det ikke er noen sentral myndighet i nettverket, kan det oppstå rare situasjoner. Selv om det er usannsynlig, er det mulig at to gyldige blokker blir funnet på samme tid (igjen: unnskyld til alle fysikere), noe som vil få klokken til å tikke frem på to forskjellige steder samtidig. Men siden de to forskjellige blokkene med stor sannsynlighet vil være forskjellige i innholdet, vil de inneholde to forskjellige historier, begge like gyldige.

Dette er kjent som en kjededeling og er en naturlig prosess for Nakamoto-konsensus. Som en fugleflokk som kort deler seg i to bare for å slå seg sammen igjen, vil noder på Bitcoin-nettverket til slutt konvergere til en delt historie etter en stund, takket være gjettingens probabilistiske natur.

Nakamoto-konsensus sier ganske enkelt at den korrekte historien er å finne i den tyngste kjeden, dvs. kjeden med mest mengde bevis-på-arbeid i seg. Derfor, hvis vi har to historier A og B, vil noen minere prøve å bygge på historie A, andre vil prøve å bygge på historie B. Så snart en av dem finner den neste gyldige blokken, er den andre gruppen programmert til å akseptere at de var på feil side av historien og går over til den tyngste kjeden - kjeden som representerer det som faktisk skjedde, per definisjon. I Bitcoin er historien virkelig skrevet av seierherrene.

> Betalingsmottakeren trenger bevis på at på tidspunktet for hver transaksjon var flertallet av nodene enige om at det var den første mottatt. […] Når det er flere dobbeltbrukte versjoner av samme transaksjon, vil én og bare én bli gyldig. Mottakeren av en betaling må vente en time eller så før han kan tro på at den er gyldig. Nettverket vil løse eventuelle dobbeltbruksløp innen den tid.

– Satoshi Nakamoto (2009)

I denne enkle uttalelsen ligger hemmeligheten bak det distribuerte koordinasjonsproblemet. Dette er hvordan Satoshi løste problemet med «samtidig betaling» som våre fiktive forretningspartnere møtte tidligere. Han løste det en gang for alle, relativistiske effekter være fordømt!

På grunn av denne sannsynligheten til Bitcoins klokke, er øyeblikket – det vi kaller kjedetuppen – alltid usikkert. Fortiden - blokker begravd under kjedetuppen - er stadig mer sikker.

> Jo grundigere forståelse som trengs, jo lenger tilbake i tid må man gå.

Gordon Clark, _Et kristent syn på menn og ting_, s. 58. (1951)

Følgelig kan Bitcoin-klokken spole tilbake fra tid til annen, for noen peers, for et tikk eller to. Hvis kjedetuppen din – det nåværende øyeblikket – tilfeldigvis taper mot en konkurrerende kjedetupp, vil klokken først spole tilbake og deretter hoppe fremover, og overstyre de siste tikkene du trodde var historie allerede. Hvis klokken din er probabilistisk, må din forståelse av fortiden også være det.

> Tikk takk takk tikk takk tikk — hva er klokken?  
Tikk takk tikk takk… det ender på [c619](https://www.blockstream.info/block/000000000000000000095eaf76a73a7986ea2e6a3b0d190fb10ab986b683c619).  
Er du sikker på at dette er greit? Er vi sannsynligvis sent ute?  
Absolutt spiller ingen rolle: før ni kommer det [åtte](https://www.blockstream.info/block/0000000000000000000318291249db2c9b658d087e4f06bcd2ed24481e81533c).  
Klokken er ikke nøyaktig; det går noen ganger i revers.  
Nøyaktig tid innebærer sentrum; det er roten til denne forbannelsen!  
Likevel fortsetter denne klokken å tikke, takk-tikk og takk-tikk, det er ingen gevinst i å lure; bare tikk-takk og neste blokk.  

– Et morsomt lite rim på Bitcoin og tid (2020)

## Konklusjon

> Tid er fortsatt et av de store mysteriene i fysikken, et som setter spørsmålstegn ved selve definisjonen av hva fysikk er.

– Jorge Cham og Daniel Whiteson: _We Have No Idea: A Guide to the Unknown Universe_, s. 117 – 118 (2017)

Å holde styr på ting i informasjonsverdenen innebærer å holde styr på et hendelsesforløp, som igjen krever å holde styr på tiden. Å holde styr på tiden krever at man blir enige om et «nå» - et øyeblikk i tid som for evig forbinder den fastslåtte fortiden med den usikre fremtiden. I Bitcoin er dette «nå» tuppen av den tyngste bevis-på-arbeid-kjeden.

To byggeklosser er essensielle for tidens struktur: årsakssammenhenger og uforutsigbare hendelser. Det kreves årsakssammenhenger for å definere en fortid, og uforutsigbare hendelser kreves for å bygge en fremtid. Hvis hendelsesforløpet ville være forutsigbart, ville det være mulig å hoppe videre. Hvis de individuelle trinnene i sekvensen ikke er koblet sammen, ville det være trivielt å endre fortiden. På grunn av den interne tidsfølelsen er det vanvittig vanskelig å jukse Bitcoin. Man måtte omskrive fortiden eller forutsi fremtiden. Bitcoins tidskjede forhindrer begge deler.

Å se Bitcoin gjennom tidens linse bør gjøre det klart at «blokkkjeden» - datastrukturen som kausalt knytter flere hendelser sammen - ikke er hovedinnovasjonen. Det er ikke engang en ny idé, noe som er tydelig ved å studere fortidens tidsstempellitteratur.

> En blokkjede er en kjede av blokker.

– Peter Todd

Det som er en ny idé – det Satoshi fant ut – er hvordan man uavhengig kan bli enige om en historie med hendelser uten sentral koordinering. Han fant en måte å implementere en desentralisert tidsstemplingsordning som (a) ikke krever et tidsstemplingsselskap eller server, (b) ikke krever en avis eller noe annet fysisk medium som bevis, og (c) kan beholde _tikker_ mer eller mindre konstante, selv når du opererer i et miljø med stadig raskere CPU-klokketider.

Tidtaking krever _årsakssammenheng_, _uforutsigbarhet_ og _koordinering_. I Bitcoin er _kausalitet_ gitt av enveisfunksjoner: de kryptografiske hash-funksjonene og digitale signaturer som er kjernen i protokollen. _Uforutsigbarhet_ er gitt av både bevis-på-arbeid-oppgaven så vel som interaksjonen med andre peers: du kan ikke vite på forhånd hva andre gjør, og du kan ikke vite på forhånd hva løsningen på bevis-på-arbeid-oppgaven vil være. _Koordinering_ er muliggjort av vanskelighetsjusteringen, den magiske sausen som knytter Bitcoins tid til vår. Uten denne broen mellom den fysiske verdenen og informasjonsverdenen, ville det være umulig å bli enige om et tidspunkt ved å stole på ingenting annet enn data.

Bitcoin er tid på mer enn én måte. Dens enheter er lagret tid fordi de er penger, og nettverket er tid fordi det er en desentralisert klokke. De nådeløse slagene til denne klokken er det som gir opphav til alle de magiske egenskapene til Bitcoin. Uten den ville Bitcoins intrikate dans falle fra hverandre. Men med det har alle på jorden tilgang til noe virkelig fantastisk: Magiske internettpenger.

«[Bitcoin is time](https://dergigi.com/2021/01/14/bitcoin-is-time/)» av Gigi. Lisens: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.no)
