---
layout: post
title: "Bitcoin-blokkjedens bevis-på-arbeid er en desentralisert klokke"
description: "Dette er en forklaring på nøkkelfunksjonen bevis-på-arbeid i Bitcoin-blokkjeden. Den fokuserer på den ene funksjonen av bevis-på-arbeid som er viktig og viser at andre funksjoner som ofte snakkes om, for eksempel sikkerhet, er sekundære bivirkninger. De er nyttige, men ikke avgjørende."
date: 2024-01-17 13:33:37 +0200
categories: bitcoin
---

av [Gregory Trubetskoy](https://grisha.org/blog/2018/01/23/explaining-proof-of-work/)

Dette er en forklaring på nøkkelfunksjonen bevis-på-arbeid i Bitcoin-blokkjeden. Den fokuserer på den ene funksjonen av bevis-på-arbeid som er viktig og viser at andre funksjoner som ofte snakkes om, for eksempel sikkerhet, er sekundære bivirkninger. De er nyttige, men ikke avgjørende.

Denne forklaringen forsøker å illustrere noen få interessante egenskaper ved hvordan bevis-på-arbeid brukes i blokkjeden som ikke er umiddelbart åpenbare og noen ganger er ganske kontraintuitive, for eksempel hvordan deltakere kollektivt løser et problem uten _noen gang å kommunisere_.

Etter å ha forstått hver av disse egenskapene, bør man konkludere med at bevis-på-arbeid først og fremst er en mekanisme som oppnår et distribuert og desentralisert system for tidtaking, dvs. en klokke.

Merk at denne skriftlige beretningen ikke handler om bevis-på-arbeid _i seg selv_, den forklarer hvordan blokkjeden utnytter det. Hvis du ikke kan noe om bevis-på-arbeid, kan [denne](https://en.bitcoin.it/wiki/Proof_of_work) lenken være en god start.

## Problemet med tidsrekkefølgen i desentraliserte hovedbøker

Før vi beskriver løsningen, la oss fokusere på problemet. Mye av litteraturen rundt bevis-på-arbeid er så forvirrende fordi den prøver å forklare løsningen uten først å identifisere problemet.

Enhver hovedbok trenger absolutt rekkefølge. Man kan ikke bruke penger som ikke er mottatt, og man kan heller ikke bruke penger som allerede er brukt. Blokkjedetransaksjoner (eller blokker som inneholder dem) må være i riktig rekkefølge, utvetydig og uten behov for en pålitelig tredjepart.

Selv om blokkjeden ikke var en hovedbok, men bare data som en logg av noe slag, kreves det samme rekkefølge for at hver node skal ha en identisk kopi av blokkjeden. En blokkjede med en annen rekkefølge er en annen blokkjede.

Men hvis transaksjoner genereres av anonyme deltakere over hele verden, og ingen sentral part er ansvarlig for å organisere listen, hvordan kan det gjøres? For eksempel kan transaksjoner (eller blokker) inkludere tidsstempler, men hvordan kan disse tidsstemplene være klarert og til å stole på?

Tid er bare et [menneskelig konsept](http://www.preposterousuniverse.com/blog/2015/04/03/the-reality-of-time/), og enhver kilde, for eksempel en atomklokke, er en «betrodd tredjepart». Som, på toppen av alt, er [litt feil](https://www.youtube.com/watch?v=-6rWqJhDv7M) mesteparten av tiden på grunn av nettverksforsinkelser samt [effekten av relativitet](http://www.astronomy.ohio-state.edu/~pogge/Ast162/Unit5/gps.html). Selv [tidsdilatasjon](https://no.wikipedia.org/wiki/Tidsdilatasjon) mellom noen i et fly kontra noen på bakken, selv om den er minuskul, er tilstrekkelig til å bestemme rekkefølgen umulig. Paradoksalt nok er det ikke mulig å stole på et tidsstempel for å bestemme hendelsesrekkefølgen i et desentralisert geografisk spredt system.

«Tiden» vi er interessert i er ikke året, måneden, dagen osv. som vi er vant til. Det vi trenger er en mekanisme der vi kan bekrefte at en hendelse fant sted før en annen eller kanskje samtidig.

Men først, for at forestillingene om før og etter skal være anvendelige, må et _tidspunkt_ etableres. Å etablere et tidspunkt kan virke teoretisk umulig i begynnelsen fordi det ikke er noen teknologi nøyaktig nok til å måle en [Planck](https://en.wikipedia.org/wiki/Planck_units#Planck_time). Men som du vil se, jobber Bitcoin rundt dette ved å lage sin egen forestilling om tid der presise tidspunkter faktisk er mulige.

Dette problemet er godt beskrevet i [Leslie Lamports](https://no.wikipedia.org/wiki/Leslie_Lamport) artikkel fra 1978 [«Time, Clocks, and the Ordering of Events in a Distributed System»](https://amturing.acm.org/p558-lamport.pdf) som faktisk ikke gir en omfattende løsning annet enn «korrekt synkroniserte fysiske klokker». I 1982 beskrev Lamport også det [«bysantinske generalproblemet»](https://people.eecs.berkeley.edu/~luca/cs174/byzantine.pdf), og Satoshi [forklarer](http://satoshi.nakamotoinstitute.org/emails/cryptography/11/) i en av sine første e-poster hvordan bevis-på-arbeid er en løsning, selv om [Bitcoin-papiret](https://bitcoin.org/bitcoin.pdf) sier «for å implementere en distribuert tidsstempelserver på en likemannsbasis, må vi bruke et bevis-på-arbeid-system», noe som antyder at det først og fremst løser spørsmålet om tidsstempling.

## Timing er hovedproblemet

Det må understrekes at _umuligheten av å assosiere hendelser med tidspunkt_ i distribuerte systemer var det uløste problemet som hindret en desentralisert hovedbok fra å være mulig før Satoshi Nakamoto fant opp en løsning. Det er mange andre tekniske detaljer som spiller inn i blokkjeden, men timing er grunnleggende og avgjørende. Uten timing er det ingen blokkjede.

## Oppsummering av bevis-på-arbeid

Veldig kort, Bitcoins bevis-på-arbeid er en verdi hvis [SHA-2](https://en.wikipedia.org/wiki/SHA-2)-hash samsvarer med et visst krav som gjør en slik verdi vanskelig å finne. Vanskeligheten etableres ved å kreve at hashen er mindre enn et spesifikt tall jo mindre tall, jo mer sjelden er inngangsverdien og jo høyere er vanskeligheten å finne den.

Det kalles «bevis på arbeid» fordi det er kjent at en verdi med en slik hash er ekstremt sjelden, noe som betyr at det å finne en slik verdi krever mye prøving og feiling, altså «arbeid». Arbeid innebærer i sin tur tid .

Ved å variere kravet kan vi variere vanskelighetsgraden og dermed sannsynligheten for at en slik hash blir funnet. Bitcoin-vanskelighetsgraden justerer seg dynamisk slik at en riktig hash blir funnet i gjennomsnitt én gang hvert tiende minutt.

## Ingenting skjer mellom blokkene

Tilstanden til kjeden reflekteres av dens blokker, og hver ny blokk produserer en ny tilstand. Blockchain-tilstanden beveger seg fremover én blokk om gangen, og gjennomsnittlig 10 minutter av en blokk er det minste målet på blokkjedetid.

## SHA er minneløs og fremdriftsfri

Secure Hash Algorithm er det som i statistikk og sannsynlighet kalles _[minneløs](https://en.wikipedia.org/wiki/Memorylessness)_. Dette er en egenskap som er spesielt kontraintuitiv for oss mennesker.

Det beste eksemplet på minneløshet er å slå kron eller mynt. Hvis vi slår kron 10 ganger på rad, betyr det at neste kast er mer sannsynlig å være mynt? Vår intuisjon sier ja, men i virkeligheten har hvert kast en 50/50 sjanse for begge utfall uavhengig av hva som skjedde umiddelbart før.

Minneløshet er nødvendig for at problemet skal være _fremdriftsfritt_. Fremdriftsfri betyr at når minerne prøver å løse blokker som itererer over [noncer](https://en.bitcoin.it/wiki/Nonce), er hvert forsøk en frittstående hendelse og sannsynligheten for å finne en løsning er konstant ved hvert forsøk, uavhengig av hvor mye arbeid som har blitt gjort tidligere. Ved hvert forsøk kommer med andre ord ikke deltakeren «nærmere» en løsning eller gjør noen fremgang. Og en miner som har lett etter en løsning i et år er ikke mer sannsynlig å løse en blokk ved neste forsøk enn en miner som startet for et sekund siden.

Sannsynligheten for å finne løsningen gitt en spesifikk vanskelighetsgrad i en gitt tidsperiode bestemmes derfor _utelukkende av hastigheten som alle deltakere kan iterere gjennom hashene på_. Ikke tidligere historie, ikke data, bare hash-rate.

Hash-raten er igjen en funksjon av antall deltakere og hastigheten på utstyret som brukes til å beregne hashen.

(NB: Selv om SHA strengt tatt ikke er fremdriftsfri fordi det er et begrenset antall hasher, er rekkevidden til et 256-bits heltall så stort at det praktisk talt er fremdriftsfritt.)

## SHA-inndatene er irrelevant

I Bitcoin-blokkjeden er inndataene et blokkhode. Men hvis vi bare matet den tilfeldige verdier, ville sannsynligheten for å finne en samsvarende hash _fortsatt være den samme_. Uansett om inndataene er et gyldig blokkhode eller bytes fra `/dev/random`, vil det i gjennomsnitt ta 10 minutter å finne en løsning.

Selvfølgelig, hvis du finner en samsvarende hash, men inndataene dine ikke var en gyldig blokk, kan en slik løsning ikke legges til blokkjeden, men den er fortsatt bevis-på-arbeid (om enn ubrukelig).

## Vanskeligheten er intergalaktisk

Pussig nok er vanskeligheten _universell_, noe som betyr at den spenner over hele universet. Vi kunne ha minere på Mars som hjelper til, de trenger ikke å vite det eller kommunisere med minerne på jorden, problemet vil fortsatt løses hvert 10. minutt. (OK, de må på en eller annen måte fortelle jordboerne at de løste det hvis de gjør det, ellers får vi aldri vite om det.)

Bemerkelsesverdig nok kommuniserer de fjerne deltakerne uten å faktisk kommunisere, fordi de i fellesskap løser det samme statistiske problemet, og likevel er de ikke engang klar over hverandres eksistens.

Denne «universelle egenskapen», selv om den til å begynne med tilsynelatende er magisk, er faktisk lett å forklare. Jeg brukte begrepet «universell» fordi det beskriver det godt i ett ord, men egentlig betyr det «kjent av hver deltaker».

Inngangen til SHA-256 kan betraktes som et heltall mellom 0 og 2<sup>256</sup> (fordi utgangen er 32 byte, dvs. også mellom 0 og 2<sup>256</sup>, alt større garanterer en kollisjon, dvs. blir overflødig). Selv om det er ekstremt stort ([eksponentielt større](https://learncryptography.com/cryptanalysis/why-is-2-256-secure) enn antall atomer i [det observerbare universet](https://no.wikipedia.org/wiki/Det_observerbare_universet)), er det et sett med tall som er kjent av hver deltaker, og deltakerne kan bare velge fra dette settet.

Hvis inngangssettet er universelt kjent, funksjonen (SHA-256) er universelt kjent, så vel som at vanskelighetsgraden er universelt kjent, så er sannsynligheten for å finne en løsning også «universell».

## Å prøve en SHA gjør deg til en deltaker

Hvis det oppgitte problemet er å finne en samsvarende hash, er alt du trenger å gjøre å prøve den én gang, og bingo, du har påvirket den globale hash-raten. Og for dette ene forsøket var du en deltaker som hjalp andre med å løse problemet. Du trengte ikke å fortelle andre at du gjorde det (med mindre du faktisk fant en løsning), andre trengte ikke å vite om det, men forsøket ditt _påvirket_ resultatet. For hele universet, intet mindre.

Hvis ovenstående fortsatt virker mistenkelig, kan en god analogi være problemet med å finne store primtall. Det er vanskelig å finne det største primtallet, og når det først er funnet, blir det «oppdaget» eller «kjent». Det er et uendelig antall primtall, men bare én forekomst av hvert tall i universet. Derfor jobber de som prøver å finne det største primtallet med det samme problemet, ikke en separat forekomst av det. Du trenger ikke fortelle noen at du har bestemt deg for å se etter det største primtallet, du trenger bare å kunngjøre når du finner et. Hvis ingen noen gang ser etter det største primtallet, vil det aldri bli funnet. Dermed påvirker deltakelse (dvs. et forsøk på å finne et), selv om det er i total hemmelighold, fortsatt utfallet, så lenge den endelige oppdagelsen (hvis den blir funnet i det hele tatt) blir offentliggjort.

Å dra nytte av dette forbløffende sannsynlighetsfenomenet der enhver deltakelse påvirker resultatet selv om det er i fullstendig hemmelighet og uten suksess, _er_ det som gjør Satoshis oppfinnelse så bemerkelsesverdig briljant.

Det er bemerkelsesverdig at siden SHA er fremdriftsfritt, kan hvert forsøk betraktes som en deltaker som blir med på innsatsen og umiddelbart drar. Dermed blir mindre med og drar, kvintillioner ganger per sekund.

## Deltakelsen er avslørt i statistikk

Den magiske hemmelige deltakelsesegenskapen fungerer også omvendt. Den globale hash-raten som er oppført på mange nettsteder er ikke kjent fordi alle gruvearbeidere registrerte seg på et «miner-registreringskontor» hvor de rapporterer hash-hastigheten sin med jevne mellomrom. Det finnes ikke noe slikt.

Hash-frekvensen er kjent fordi for å finne en løsning med en spesifikk vanskelighetsgrad på 10 minutter, i gjennomsnitt så mange forsøk (~ 10<sup>21</sup> når dette skrives) måtte være gjort av noen et sted.

Vi vet ikke hvem disse deltakerne er, de har aldri annonsert at de jobber, de som ikke fant en løsning (som er praktisk talt alle sammen) fortalte aldri noen at de jobbet, deres plassering kunne ha vært hvor som helst i universet, og likevel vet vi med absolutt sikkerhet at de eksisterer. Rett og slett fordi problemet fortsetter å bli løst.

## Arbeid er en klokke

Og her ligger kjernen i det: Vanskeligheten med å finne en samsvarende hash fungerer som _en klokke_. En universell klokke, om du vil, fordi det bare er én slik klokke i universet, og dermed er det ingenting å synkronisere og hvem som helst kan «se» på den.

Det gjør ikke noe at denne klokken er upresis. Det som betyr noe er at det er den samme klokken for alle og at tilstanden til kjeden kan knyttes entydig til denne klokkens tikk.

Denne klokken betjenes av multi-exahash-frekvensen til et ukjent antall kollektive deltakere spredt over hele planeten, helt uavhengig av hverandre.

## Siste brikke i puslespillet

Løsningen må være hashen til en blokk (blokkhodet, for å være presis). Som vi nevnte, spiller ikke inndata noen rolle, men hvis det er en faktisk blokk, så, når en løsning er funnet, skjedde det ved tikken av vår bevis-på-arbeid-klokke. Ikke før, ikke etter, men _nøyaktig da_. Vi vet dette utvetydig fordi blokken var en del av den mekanismen.

For å si det på en annen måte, hvis blokker ikke var inngangen til SHA256-funksjonen, ville vi fortsatt ha en distribuert klokke, men vi kunne ikke knytte blokker til tikkene på denne klokken. Bruk av blokker som inndata løser dette problemet.

Bemerkelsesverdig, vår bevis-på-arbeid-klokke gir oss bare tikker. Det er ingen måte å fortelle rekkefølge fra tikkene, det er dette hash-kjeden er til for.

## Hva med den distribuerte konsensusen?

Konsensus betyr enighet. Det alle deltakerne ikke har annet valg enn å bli enige om er at _klokken har tikket_. Også at alle kjenner tikken og dataene knyttet til den. Og dette løser faktisk det bysantinske generalproblemet, som Satoshi forklarte i en e-post referert til tidligere.

Det er en egen konsensus i et sjeldent, men vanlig tilfelle av to påfølgende tikker som er assosiert med motstridende blokker. Konflikten løses av hvilken blokk som vil bli assosiert med neste tikk, noe som gjør en av de omstridte blokkene «foreldreløs». Hvordan kjeden vil fortsette er et spørsmål om tilfeldigheter, og så også dette kan nok indirekte tilskrives bevis-på-arbeid-klokken.

## Og det er det

Dette er hva bevis-på-arbeid gjør for blokkjeden. Det er ikke et «lotteri» hvor minerne vinner retten til å løse en blokk, og det er heller ikke noen særegen konvertering av ekte energi til et verdifullt konsept. Disse er alle villspor.

For eksempel er lotteriet og minernes belønningsaspekt det som oppmuntrer minerne til å delta, men det er ikke det som gjør blokkjeden mulig. Blokker-hasher danner en kjede, men igjen, det har ingenting å gjøre med bevis-på-arbeid, det forsterker den kryptografiske inngraveringen av blokkrekkefølgen. Hash-kjeden gjør også de forrige tikkene «sikrere», «mindre benektbare» eller rett og slett tryggere.

Bevis-på-arbeid er også mekanismen hvis blokker effektivt blir uforanderlige ved, og det er en fin bieffekt som gjør Segregated Witness mulig, men det kan like gjerne gjøres ved å bevare signaturene (vitne), så også dette er sekundært.

## Konklusjon

Bitcoin-blokkjedens bevis-på-arbeid er ganske enkelt en distribuert, desentralisert klokke.

Hvis du forstår denne forklaringen, bør du ha en mye bedre forståelse av hvordan bevis-på-arbeid sammenlignes med [proof-of-stake](https://en.wikipedia.org/wiki/Proof_of_stake), og det bør være tydelig at de to ikke er sammenlignbare: Proof-of-stake handler om (tilfeldig distribuert) autoritet, mens bevis-på-arbeid er en klokke.

I sammenheng med blokkjeden er bevis-på-arbeid sannsynligvis en feilbetegnelse. Begrepet er en arv fra [Hashcash](https://en.wikipedia.org/wiki/Hashcash)-prosjektet, hvor det faktisk tjente til å bevise arbeid. I blokkjeden handler det først og fremst om å verifiserbart ta tid. Når man ser en hash som tilfredsstiller vanskelighetsgraden, vet man at det må ha tatt tid. Metoden som forsinkelsen utføres på er «arbeid», men hashen er først og fremst interessant fordi den er et bevis på _tiden_.

Det faktum at bevis-på-arbeid handler om tid i stedet for arbeid, tyder også på at det kan være andre lignende statistiske utfordringer som er tidkrevende, men som krever mindre energi. Det kan også bety at Bitcoin-hash-raten er for høy og at Bitcoin-klokken vi beskrev ovenfor kan fungere like pålitelig på en brøkdel av hash-raten, men det er insentivstrukturen som driver opp energiforbruket.

Å finne ut en måte å sette farten på med mindre arbeid er et billion dollar-problem. Hvis du finner en løsning, vennligst gi meg beskjed!

PS: Spesiell takk til [Sasha Trubetskoy](http://sashat.me/) fra [UChicago Statistics](https://galton.uchicago.edu/) for gjennomgangen og forslagene til teksten ovenfor.
