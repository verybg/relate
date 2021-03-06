var marriageGame = document.getElementById('marriage_game')


if (exist(marriageGame)) {
    if (typeof (EventSource) !== "undefined") {

        var gameHeader = marriageGame.querySelector('.game-header')
        var gameTitleDesc = marriageGame.querySelector('.game-title-desc')
        var gameTitle = marriageGame.querySelector('.game-title')
        var gameContent = marriageGame.querySelector('.game-content')
        var gameFooter = marriageGame.querySelector('.game-footer')
        var prevBtn = marriageGame.querySelector('.game-footer .before')
        var nextBtn = marriageGame.querySelector('.game-footer .next')
        var outBtn = marriageGame.querySelector('.game-footer .out_of_game')

        var notification = new Audio(texts.notification_src);

        var waitingStart = null
        var gameTable = null
        var cardsNav = null
        var gameInfo = null
        var cardsHeaderTitle = null
        var currentCardWrap = null
        var currentCardInfo = null
        var currentCardInfo2 = null
        var specialCardsWrap = null
        var voiceCard = null
        var specialCardsTitle = null
        var specialCardsInfo = null
        var voiceCardBtn = null
        var voiceCardCurrent = null
        var prevCardBtn = null
        var nextCardBtn = null
        var drawPlayerBtn = null
        var drawWait = null
        var gameTopStatus = null
        var gameTopUser = null
        var gameTopUserCategory = null
        var gameTopPartner = null
        var gameTopPartnerCategory = null
        var gameTopInfo = null

        var gameTop = null

        var stage = null
        var startStage = null
        var partnerStartStage = null
        var gameFlow = {
            userShowedPositivesCards: 0,
            userShowedCategoryCards: 0,
            partnerShowedPositivesCards: 0,
            partnerShowedCategoryCards: 0,
        }

        var currentCard = {
            id: null,
            positive: null,
            key: null,
            counter: null
        }
        var previousCard = currentCard
        var startUser = null

        var selectedCategory = null
        var partnerSelectedCategory = null

        var selectedExpectations = []
        var selectedPositives = []
        var partnerSelectedExpectations = []
        var partnerSelectedPositives = []

        var voiceCardBreak = null
        var partnerVoiceCardBreak = null

        var resolution = null
        var partnerResolution = null

        var startPopup = null
        var dismissStartGamePopup = null
        var startPopupShown = null
        var specialCardPopup = null

        var categories = [
            { 'name': 'Relacja', 'slug': 'relacja' },
            { 'name': 'Seks', 'slug': 'seks' },
            { 'name': 'Dzieci', 'slug': 'dzieci' },
            { 'name': 'Te??ciowie', 'slug': 'tesciowie' },
            { 'name': 'Praca', 'slug': 'praca' }
        ]

        var specialCards = [
            {
                'name': 'Przerywasz', 'slug': 'przerywasz', 'type': 'voice-card-active',
                'infoActive': `${texts.current_user_gender == 'M' ? 'Przerwa??e?? jej' : 'Przerwa??a?? mu'} wypowied?? nie maj??c Karty G??osu. Ponosisz wcze??niej ustalone konsekwencje.`,
                'infoInactive': `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'przerwa??' : 'przerwa??a'} Ci wypowied?? nie maj??c Karty G??osu. Ponosi wcze??niej ustalone konsekwencje.`,
                'info': `Je??eli ${texts.partner_name} przerwie Ci wypowied?? nie maj??c Karty G??osu, wci??nij kart?? <strong>Przerywasz</strong>`
            },
            {
                'name': 'Sprawdzam', 'slug': 'sprawdzam', 'type': 'voice-card-active',
                'infoActive': `Zanim powiesz co o tym my??lisz, musisz powiedzie?? co ${texts.current_user_gender == 'M' ? 'us??ysza??e??' : 'us??ysza??a??'}, czyli jak rozumiesz ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} oczekiwania. Dopiero kiedy ${texts.partner_name} potwierdzi, ??e w??a??nie to ${texts.current_user_gender == 'M' ? 'chcia??a' : 'chcia??'} powiedzie?? mo??esz przej???? do komentarza ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} oczekiwania.`,
                'infoInactive': `${texts.partner_name} ma za zadanie powiedzie?? w??asnym s??owami jak rozumie Twoje oczekiwanie. Bez potwierdzenia, ??e o to Ci chodzi??o nie mo??e powiedzie?? co o tym my??li.`,
                'info': `Je??eli chcesz, aby ${texts.partner_name} powiedzia??a w??asnymi s??owami jak rozumie Twoje oczekiwania.`
            },
            {
                'name': 'Tak, ale...', 'slug': 'tak-ale', 'type': 'voice-card-inactive',
                'infoActive': `${texts.current_user_gender == 'M' ? 'U??y??e??' : 'U??y??a??'} s????w ???tak, ale???, co mo??e oznacza??, ??e zmieniasz temat, odbijasz pi??eczk??, lub pr??bujesz si?? usprawiedliwi??. Zacznij jeszcze raz, spr??buj ws??ucha?? si?? w oczekiwania, jakie ma ${texts.partner_name} i zrozumie?? ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} perspektyw??.`,
                'infoInactive': `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'u??y??' : 'u??y??a'} s????w ???tak, ale???. ${texts.partner_user_gender == 'M' ? 'Jego' : 'Jej'} zadaniem jest zmiana sposobu wypowiedzi, bez zmiany tematu i tzw. ???odbijania pi??eczki???.`,
                'info': `Je??eli ${texts.partner_name} u??yje s????w ???Tak, ale???.`
            },
            {
                'name': 'M??w o sobie', 'slug': 'mow-o-sobie', 'type': 'voice-card-inactive',
                'infoActive': `M??wisz o ${texts.partner_user_gender == 'M' ? 'nim' : 'niej'}, np. ${texts.current_user_gender == 'M' ? 'jaka' : 'jaki'} jest, co robi ??le lub ${texts.current_user_gender == 'M' ? 'jaka powinna' : 'jaki powinien'} by??. Spr??buj m??wi?? o sobie i swoich odczuciach w zwi??zku z omawian?? spraw??.`,
                'infoInactive': `${texts.partner_name} nie m??wi o sobie. ${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest zmiana sposobu wypowiedzi tak, ??eby m??wi?? o sobie i swoich odczuciach`,
                'info': `Je??eli ${texts.partner_name} m??wi o Tobie oceniaj??c Ci?? lub udziela Ci rad. Np. ???Ty ci??gle??????, ???Ty jeste????????, ???Zmie?? si????? itp.`
            },
            {
                'name': 'Pozw??l mi czu??', 'slug': 'pozwol-mi-czuc', 'type': 'voice-card-inactive',
                'infoActive': `Kwestionujesz ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} uczucia np. poprzez udzielanie rad, racjonalne t??umaczenie fakt??w, zaprzeczanie, ??e to co m??wi nie jest prawd??. Spr??buj powstrzyma?? si?? od tego typu wypowiedzi, nie traktuj tego osobi??cie, uznaj ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} prawo do prze??ywania tych uczu??.`,
                'infoInactive': `${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest uzna?? Twoje uczucia, nie komentowa?? ich i im nie zaprzecza??.`,
                'info': `Kiedy ${texts.partner_name} kwestionuje Twoje uczucia np. poprzez udzielanie rad lub t??umaczenie rzeczywisto??ci tylko faktami. `
            },
            {
                'name': 'Fakty czy wyobra??enia', 'slug': 'fakty-czy-wyobrazenia', 'type': 'voice-card-inactive',
                'infoActive': `Prawdopodobnie mylisz fakty z wyobra??eniami. Spr??buj zacz???? swoj?? wypowied?? od s????w: Wyobra??am lub ${texts.current_user_gender == 'M' ? 'wyobrazi??em' : 'wyobrazi??am'} sobie, ??e???. Zobaczysz jak bardzo to potrafi uspokoi?? emocje i przybli??y?? Was do zrozumienia siebie.`,
                'infoInactive': `${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest rozpocz??cie kolejnego zdania od s????w: ???Wyobra??am sobie, ??e???.???`,
                'info': `Je??eli czujesz, ??e ${texts.partner_name} przeinacza fakty i masz potrzeb?? udowadniania ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'}, ??e tak nie by??o.`
            },
            {
                'name': 'Moje emocje', 'slug': 'moje-emocje', 'type': 'hidden',
                'infoActive': `W tym momencie ${texts.partner_name} prze??ywa bardzo silne emocje w zwi??zku z tym co m??wisz. Daj ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'} chwil?? na uspokojenie, zastan??w si?? w jaki spos??b mo??esz to ??agodniej wyrazi?? i poczekaj a?? odblokuje Kart?? Stop`,
                'infoInactive': `Emotka`,
                'info': `Je??eli czujesz, ??e nie jeste?? w stanie d??u??ej wytrzyma??, Twoje emocje s?? zbyt silne, naci??nij kart?? Stop da Ci to chwil??, ??eby och??on????.`
            },
            {
                'name': 'Moje emocje', 'slug': 'wybierz-emocje', 'type': 'voice-card-inactive',
                'infoActive': ``,
                'infoInactive': `Emotki`,
                'info': `Je??eli czujesz, ??e nie jeste?? w stanie d??u??ej wytrzyma??, Twoje emocje s?? zbyt silne, naci??nij kart?? Stop da Ci to chwil??, ??eby och??on????.`
            },
            {
                'name': 'Stop', 'slug': 'stop', 'type': 'voice-card-inactive',
                'infoActive': `W tym momencie ${texts.partner_name} prze??ywa bardzo silne emocje w zwi??zku z tym co m??wisz. Daj ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'} chwil?? na uspokojenie, zastan??w si?? w jaki spos??b mo??esz to ??agodniej wyrazi?? i poczekaj a?? odblokuje Kart?? Stop`,
                'infoInactive': `Jak b??dziesz ${texts.current_user_gender == 'M' ? 'gotowy' : 'gotowa'} do dalszej rozmowy odblokuj kart?? Stop.`,
                'info': `Je??eli czujesz, ??e nie jeste?? w stanie d??u??ej wytrzyma??, Twoje emocje s?? zbyt silne, naci??nij kart?? Stop da Ci to chwil??, ??eby och??on????.`
            },
            {
                'name': 'Komunikacja', 'slug': 'instrukcja', 'type': 'hidden',
                'info': `Komunikacja w zwi??zku, a szczeg??lnie rozwi??zywanie konflikt??w, jest sporym wyzwaniem dla ka??dej pary. Partner??w rzadko dzieli brak mi??o??ci i zaanga??owania, to nast??puje dopiero, gdy strac?? do siebie zaufanie, albo wcale. To, co ich dzieli, to nieumiej??tno???? poradzenia sobie z przykrymi emocjami. Umiej??tno???? rozumienia, kontrolowania i wyra??ania emocji w budowaniu relacji odgrywa fundamentalne znaczenie. Opracowuj??c Gr?? Relate, starali??my si?? zawrze?? w niej podstawowe zasady skutecznej komunikacji. Nasze do??wiadczenie pokazuje, ??e je??eli para jest dobrze zmotywowana do pracy i zrozumie, co robi??, a czego unika??, to bardzo szybko mo??e zobaczy?? pozytywne efekty swojej pracy. <strong>Gra Relate</strong> mo??e by?? w tym bardzo pomocna.<br>W Grze Relate znajdziecie tzw. Karty Specjalne, to w??a??nie w nich zawarty jest klucz do sukcesu.`,
            }
        ]

        var specialCardsInfoTexts = [
            {
                'name': 'Zasady komunikacji',
                'slug': 'zasady',
                'info': `Komunikacja w zwi??zku, a szczeg??lnie rozwi??zywanie konflikt??w, jest sporym wyzwaniem dla ka??dej pary. Partner??w rzadko dzieli brak mi??o??ci i zaanga??owania, to nast??puje dopiero, gdy strac?? do siebie zaufanie, albo wcale. To, co ich dzieli, to nieumiej??tno???? poradzenia sobie z przykrymi emocjami. Umiej??tno???? rozumienia, kontrolowania i wyra??ania emocji w budowaniu relacji odgrywa fundamentalne znaczenie. Opracowuj??c Gr?? Relate, starali??my si?? zawrze?? w niej podstawowe zasady skutecznej komunikacji. Nasze do??wiadczenie pokazuje, ??e je??eli para jest dobrze zmotywowana do pracy i zrozumie, co robi??, a czego unika??, to bardzo szybko mo??e zobaczy?? pozytywne efekty swojej pracy. <strong>Gra Relate</strong> mo??e by?? w tym bardzo pomocna.<br>W Grze Relate znajdziecie tzw. Karty Specjalne, to w??a??nie w nich zawarty jest klucz do sukcesu.`,
            },
            {
                'name': 'Karta G??osu',
                'slug': 'karta-glosu',
                'info': `M??wi tylko ten, kto j?? posiada. Bardzo cz??sto podczas rozmowy druga strona przerywa, komentuje, ??apie za s??owo, zmienia temat. Jest to spowodowane ch??ci?? wyja??nienia, sprostowania, zaprotestowania. Rozm??wcom wydaje si??, ??e brak reakcji jest r??wnoznaczny z przyznaniem si?? do winy albo oznak?? s??abo??ci, dlatego trzeba szybko zaprotestowa??. Jest to najcz????ciej pope??niany b????d podczas trudnych rozm??w. Wiele par zaczyna rozmow?? od sprawy, ale niestety kolejnym etapem jest k????tnia o przebieg k????tni. W ten spos??b nie rozwi??zuj?? nieporozumienia, kr??c?? si?? w k????ko, zwi??kszaj??c tylko konflikt. Emocje mog?? gwa??townie przybiera?? na sile, ale przy braku mo??liwo??ci roz??adowania, najcz????ciej b??d?? s??abn????, bo taka jest ich natura. Pojawia si?? wi??cej rozs??dku, osoba m??wi??ca ma mo??liwo???? dok??adnego wyja??nienia, o co chodzi, nie jest ??apana za s????wka ani wybijana z toku wypowiedzi. Nazwanie problemu cz??sto jest trudne i wymaga czasu, zastanowienia si??. Potem, kiedy dostaje si?? ju?? Kart?? G??osu, najcz????ciej ju?? nie pami??ta si?? tych wszystkich temat??w, na kt??re chcia??o si?? zareagowa??, i troch?? o to chodzi ??? zostaje najwa??niejsze. Efektem stosowania tej zasady b??dzie: kontrolowanie swoich emocji, poczucie bycia szanowanym, rozumienie siebie.`,
            },
            {
                'name': 'Sprawdzam',
                'slug': 'sprawdzam',
                'info': `Sprawdzam. Zanim powiesz, co o tym my??lisz, spr??buj powiedzie??, co us??ysza??e??. Przyczyn?? pojawienia si?? negatywnych emocji podczas rozmowy nie s?? s??owa partnera tylko nasza interpretacja tych s????w. A interpretacja powstaje pod wp??ywem naszego aktualnego samopoczucia, nastawienia do rozm??wcy, a przede wszystkim wcze??niejszych do??wiadcze??. I tutaj pojawiaj?? si?? powa??ne bariery. Np. on m??wi do niej: ???Kup sobie ksi????k?????, a ona s??yszy, ??e jest idiotk??; ona m??wi do niego: ???Posprz??taj w gara??u???, a on s??yszy, ??e jest totalnym nierobem i wykrzykuje, ??e ma ju?? dosy?? takiego traktowania; on m??wi, ??e w tamtej sukience by??o jej lepiej, a ona s??yszy, ??e jest brzydka i ju?? mu si?? znudzi??a. Powstrzymanie si?? od wypowiedzenia swojej opinii i uprzednie upewnienie si??, czy dobrze rozumie si?? wypowied?? partnera, jest kluczowe dla osi??gni??cia porozumienia. Dlatego warto razem z Kart?? G??osu przekaza?? kart?? Sprawdzam. Efektem zastosowania tej zasady b??dzie: poczucie bycia rozumianym, brak k????tni, docieranie do sedna sprawy.`,
            },
            {
                'name': 'Tak, ale...',
                'slug': 'tak-ale',
                'info': `Nie zmieniajcie tematu, nie odbijajcie pi??eczki, rozmawiajcie o jednej sprawie. Postawa, ??e najlepsz?? obron?? jest atak, skutecznie wdra??ana jest przez u??ywanie s????w: ???Tak, ale???. Np. ona m??wi: ???Nigdzie ze mn?? nie wychodzisz. Kiedy ostatnio gdzie?? mnie zaprosi??e??????. A on odpowiada: ???Tak, ale ty ci??gle narzekasz, bez przerwy masz pretensje i licz?? si?? dla ciebie tylko dzieci???. S?? to dwa r????ne tematy. W takim dialogu pojawia si?? licytacja, kto jest bardziej pokrzywdzony i nieszcz????liwy. Trudno oczekiwa?? porozumienia, skoro obowi??zuje zasada: ???Skoro ty mi tak robisz, to ja mam prawo zrobi?? ci podobnie???. Para, kt??rej uda si?? zatrzyma?? ???Tak, ale??????, zaczyna lepiej si?? s??ucha??, skupiaj?? si?? na jednym temacie, pozostaje w nich poczucie bycia rozumianym.`,
            },
            {
                'name': 'M??w o sobie',
                'slug': 'mow-o-sobie',
                'info': `Jest to dosy?? trudna karta w zastosowaniu, gdy?? wymaga dobrej ??wiadomo??ci swoich uczu??. Generalnie, dobra komunikacja gwarantuj??ca porozumienie charakteryzuje si?? m??wieniem w formie ???ja???, bez wydawania opinii o drugiej stronie. Np. zamiast: ???Jeste?? nieczu??y???, pojawia si??: ???Czuj?? si?? opuszczana???, zamiast ???Jeste?? leniwa???, pojawi si?? ???Czuj?? si?? lekcewa??ony???. Taka forma rozmowy eliminuje: ty ci??gle, zawsze, nigdy, zmie?? si??, bo ty jeste??. Dla niekt??rych mo??e to by?? zaskakuj??ce, bo dotychczas u??ywali tylko takich sformu??owa?? i nie wiedz??, ??e mo??na inaczej. Karty w grze s?? tak sformu??owane, ??eby m??wi?? o swoich uczuciach. Warto je poczyta??, gdy?? mog?? by?? konkretn?? podpowiedzi??, w jaki spos??b wyra??a?? swoje oczekiwania. Wiele os??b po grze stwierdza, ??e poruszyli bardzo trudny temat i nie pok????cili si??, co wcze??niej by??o niemo??liwe. Dzi??ki takim sformu??owaniom druga strona nie czuje si?? zaatakowana, a jedynie skonfrontowana ze swoim zachowaniem lub postaw??.`,
            },
            {
                'name': 'Pozw??l mi czu??',
                'slug': 'pozwol-mi-czuc',
                'info': `Nic tak nie boli i nie kwestionuje naszej warto??ci jak wmawianie, ??e nasze uczucia s?? z??e, ??e nie powinni??my tak czu??. Nie ma uczu?? dobrych ani z??ych, s?? przykre i przyjemne. Wiele os??b, zw??aszcza m????czyzn, uznaje emocje swojej partnerki za s??abo???? i stosuje taktyk?? krytyki za uczucia, m??wi??c np.: ???Przesadzasz???, ???Uspok??j si?????, ???Znowu panikujesz???, ???Sk??d ty to wymy??li??a??????. Uznanie czyjego?? prawa do prze??ywania na sw??j spos??b danej sprawy jest kluczowym elementem potrzebnym do zbudowania bliskiej relacji. Kwestionowanie uczu?? jest kwestionowaniem czyjej?? warto??ci, form?? nieakceptacji osoby. Ka??dy ma swoj?? wra??liwo????, swoje do??wiadczenia, sw??j dzie??, a cech?? emocji jest potrzeba ich wyra??enia, wtedy dopiero ma si?? do nich wi??cej dystansu. Ogromnym sukcesem dla pary jest, kiedy oboje pozwalaj?? sobie czu??, zw??aszcza: z??o????, s??abo????, smutek, zazdro????, wstyd, l??k, nieporadno????, ??al. To w??a??nie z akceptacj?? tych emocji mamy najcz????ciej najwi??cej problem??w. Czucie z??o??ci nie oznacza, ??e jestem z??ym cz??owiekiem, a czucie s??abo??ci, ??e jestem s??aby. Efektem rozumienia tej zasady b??dzie: nieudzielanie rad, nieprzerywanie sobie, odr????nienie emocji od postawy.`,
            },
            {
                'name': 'Fakty czy wyobra??enia',
                'slug': 'fakty-wyobrazenia',
                'info': `Odr????nienie fakt??w od wyobra??e?? podczas trudnych rozm??w to kolejny milowy krok do szybkiego porozumienia. Zadaniem osoby, kt??ra otrzyma tak?? kart?? podczas swojej wypowiedzi, jest rozpocz??cie kolejnego zdania od s????w: ???Wyobra??am sobie, ??e??????. Np. po spotkaniu u znajomych ona m??wi: ???Widzia??am, jak flirtowa??e?? z Magd?????. Faktem by??o, ??e z ni?? rozmawia??, a wyobra??eniem, ??e z ni?? flirtowa??. Gdyby powiedzia??a: ???Jak rozmawia??e?? z Magd??, to wyobrazi??am sobie, ??e z ni?? flirtujesz???, unikn????aby oskar??enia i da??a mu przestrze?? na wyja??nienie bez oceniania. A gdyby jeszcze doda??a: ???Jak widz?? ??adne dziewczyny, to jestem zazdrosna??? albo ???Boj?? si??, ??e mnie opu??cisz???, to prawdopodobnie dosta??aby zapewnienie, ??e jest najpi??kniejsz?? kobiet?? na ??wiecie. Efektem zastosowania tej karty b??dzie: przej??cie z poziomu oskar??enia na poziom rozumienia siebie, swoich potrzeb i emocji, unikni??cie k????tni, poczucie ulgi, zmiana perspektywy.`,
            },
            {
                'name': 'Moje emocje',
                'slug': 'moje-emocje',
                'info': `Umiej??tno???? u??wiadomienia sobie, nazwania i w??a??ciwego wyra??enia emocji podczas rozmowy to prawdziwy klucz do sukcesu. Kontakt z emocjami przede wszystkim zale??y od naszych rodzin pochodzenia. Je??eli mogli??my jako dzieci swobodnie je wyra??a?? i nie byli??my za nie karani, oceniani, wy??miewani, to mieli??my du??e szcz????cie. W wielu rodzinach funkcjonuj?? tzw. mapy emocjonalne, na kt??rych znajduj?? si?? martwe pola. Pewnych emocji nie wolno by??o czu??, wyra??a??, bo by??o si?? za to karanym obra??aniem si??, wzbudzaniem poczucia winy, krzykiem, odrzuceniem. Dziecko na swoich etapach rozwoju czuje wszystko: rado???? smutek, z??o????, fascynacj??, s??abo????, strach, wstyd, niepewno????, dum??. Je??eli nie dostali??my mo??liwo??ci wyra??ania tych uczu?? w dzieci??stwie, to musimy to nadrabia?? w ??yciu doros??ym, bo trudno by?? w bliskiej relacji bez akceptacji swoich i czyi?? emocji. Karta Moje emocje daje mo??liwo???? nazywania uczu?? podczas rozmowy, takich jak: rado????, mi??o????, smutek, przykro????, z??o????, niepewno????, l??k. Efektem jej stosowania b??dzie: budowanie atmosfery akceptacji siebie nawzajem, os??abienie nasilenia emocji, mo??liwo???? zrozumienia siebie.`,
            },
            {
                'name': 'Stop',
                'slug': 'stop',
                'info': `Czasami podczas rozmowy pojawiaj?? si?? tak silne emocje, ??e trudno jest kontynuowa?? dalej bez wywo??ania k????tni. Dla emocji charakterystyczne jest, ??e mog?? gwa??townie wzrosn????, osi??gaj??c swoje apogeum, ale potem opadaj??. M??wi si??, ??e czysty gniew trwa 15 sekund. B??d??c na szczycie intensywno??ci emocji, trudno nam z??apa?? dystans, da?? sobie czas na ich nazwanie, przej??cie i os??abienie. Karta Stop ma pom??c w przeczekaniu trudnych i intensywnych emocji, ??eby m??c wr??ci?? do rozmowy. Je??eli czujesz, ??e trudno Ci dalej s??ucha??, mo??esz na chwil?? zatrzyma?? rozmow??, ??eby och??on????. Kontynuowanie jej w tym stanie nasili konflikt. Najcz????ciej do najsilniejszych negatywnych emocji nale??y z??o???? i przykro????. Efektem zastosowania tej karty b??dzie: nazwanie swoich emocji, oswojenie si?? z dyskomfortem, kt??rego dostarczaj??, unikni??cie k????tni lub przerwania dialogu. Stosowanie karty nie mo??e prowadzi?? do blokowania emocji, ma pom??c przeczeka?? ich nasilenie.`,
            },
            {
                'name': 'Wa??na uwaga',
                'slug': 'wazna-uwaga',
                'info': `Wiele os??b oczekuje prostej recepty i szybkich efekt??w naprawy relacji w zwi??zku. Zniech??caj?? si??, nie widz??c poprawy. Wyznacznikiem sukcesu jest determinacja i cierpliwo????. Dobrej komunikacji w zwi??zku nie mo??na sprowadzi?? do technik zachowania czy m??wienia. Wiedza jest bardzo wa??na, stwarza szans??, ale ostatecznie zbudowanie bliskiej relacji jest mocno zwi??zane z rozumieniem siebie, zw??aszcza swoich potrzeb, intencji oraz umiej??tno??ci?? nazywania, prze??ywania i wyra??ania emocji. Dlatego powy??szych zasad mo??e nie uda si?? Wam wprowadzi?? w ??ycie od razu, ale dzi??ki Grze Relate b??dziecie mogli nabra?? wprawy w przeprowadzaniu konstruktywnych rozm??w. W przypadku braku post??p??w mo??e okaza?? si??, ??e potrzebujecie profesjonalnej pomocy, jak?? jest psychoterapia, kt??ra daje mo??liwo???? g????bszego rozumienia siebie i odblokowania emocji.<br><br>??yczymy cierpliwo??ci, zrozumienia i blisko??ci.
                <br>Agnieszka i Jakub Ko??odziejowie ??? autorzy Gry Relate
                `,
            }

        ]

        var specialCardCurrent = null

        var expectations = []

        var gameID = null
        setGameID()


        function categoriesCardsGenerator() {
            const categoriesWrap = document.createElement('div')
            categoriesWrap.classList = 'categories cards'

            const cards = document.createElement('div')
            cards.classList = 'cards-content'

            const cardsInner = document.createElement('div')
            cardsInner.classList = 'cards-inner'

            categories.forEach((category) => {
                let card = document.createElement('div')
                card.classList = 'card'
                card.innerText = category.name
                cardsInner.appendChild(card)

                card.addEventListener('click', function (e) {
                    categoriesWrap.style.pointerEvents = 'none'
                    this.classList.toggle('selected')

                    if (selectedCategory != category.slug) {
                        selectedCategory = category.slug
                        save_marriage_game_data('category', selectedCategory)

                        selectedExpectations = []
                        save_marriage_game_data('expectations', selectedExpectations)
                    }


                    showCurrentCategoryCards()

                    // setTimeout(() => {
                    //     categoriesWrap.classList.add('d-none')
                    // }, 300)

                })
            })
            cards.appendChild(cardsInner)

            categoriesWrap.appendChild(cards)
            gameContent.appendChild(categoriesWrap)
        }

        function showCategoriesCards() {

            stage = 'selectCategory'
            gameTitle.innerHTML = 'Wybierz tematyk?? do rozmowy'
            gameTitleDesc.innerHTML = ''
            gameContent.innerHTML = ""
            categoriesCardsGenerator()

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtn.disabled = true

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showSortPositives()
            }, { once: true })

        }

        function getCards() {
            return new Promise(resolve => {

                if (expectations.length <= 0) {
                    let data = {
                        'action': 'get_marriage_game_cards',
                        'nonce': gameSettings.nonce,
                        'category': selectedCategory,
                    }

                    let dataString = (new URLSearchParams(data)).toString()

                    fetch(gameSettings.ajax_url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        body: dataString,
                        credentials: 'same-origin',
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            let categories = marriageGame.querySelector('.categories')

                            if (exist(categories)) categories.remove()

                            expectations = expectations.concat(data.cards)
                            categoriesCardsGenerator()

                            resolve('resolved');
                            // test_start()
                        })
                        .catch((error) => {
                            console.error(error)

                        })
                }

            });

        }

        function allExpectationsGenerator() {
            const categoriesWrap = document.createElement('div')
            categoriesWrap.classList = 'categories-cards cards'

            const cardsHeader = document.createElement('div')
            cardsHeader.classList = 'cards-header'

            cardsHeaderTitle = document.createElement('h3')
            cardsHeader.appendChild(cardsHeaderTitle)

            const cardsHeaderDesc = document.createElement('p')
            // cardsHeaderDesc.classList = 'mb-1'

            // const cardSelectedFilter = document.createElement('button')
            // cardSelectedFilter.innerHTML = texts.filterCardBtn
            // cardSelectedFilter.classList = 'btn btn-outline-light btn-sm filter-selected-cards'
            // cardsHeaderDesc.appendChild(cardSelectedFilter)

            // cardSelectedFilter.disabled = true
            // cardSelectedFilter.addEventListener('click', function () {
            //     this.classList.toggle('filter-active')
            //     toggleSelectedCards()

            //     if (this.classList.contains('filter-active')) {
            //         this.innerHTML = texts.filterCardBtnActive
            //     } else {
            //         this.innerHTML = texts.filterCardBtn
            //     }

            // })

            cardsHeader.appendChild(cardsHeaderDesc)

            const cards = document.createElement('div')
            cards.classList = 'cards-content'

            const cardsInner = document.createElement('div')
            cardsInner.classList = 'cards-inner'

            let forWhom = texts.current_user_gender == 'M' ? 'dla_niego' : 'dla_niej'

            expectations.filter(el => el.for_whom == forWhom).forEach((expectation) => {
                const card = document.createElement('div')
                card.classList = 'card'

                if (selectedExpectations.includes(parseInt(expectation.id)) || selectedPositives.includes(parseInt(expectation.id))) {
                    card.classList.add('selected')
                }

                card.innerText = expectation.title
                card.dataset.category = expectation.category
                card.dataset.id = expectation.id

                cardsInner.appendChild(card)

                card.addEventListener('click', function (e) {
                    this.classList.toggle('selected')

                    if (this.classList.contains('selected')) {
                        if (card.dataset.category == 'pozytywy') {
                            selectedPositives.push(expectation.id)
                        } else {
                            selectedExpectations.push(expectation.id)
                        }
                    } else {
                        if (card.dataset.category == 'pozytywy') {
                            selectedPositives = selectedPositives.filter(function (item) {
                                return item !== expectation.id
                            })
                        } else {
                            selectedExpectations = selectedExpectations.filter(function (item) {
                                return item !== expectation.id
                            })
                        }
                    }

                    cardsCounter()

                    // toggleSelectedFilterButton()
                    equal = false
                    if (stage == 'selectPositivesFinal' || stage == 'selectCategoryCardsFinal') equal = true;
                    nextBtnState(getSelectedCardsTotal(), getSelectedCards(), equal)

                    // toggleCardFilterVisibility(this)

                })
            })



            categoriesWrap.appendChild(cardsHeader)
            cards.appendChild(cardsInner)
            categoriesWrap.appendChild(cards)
            gameContent.appendChild(categoriesWrap)
        }

        function getSelectedCardsTotal() {
            let total = ""
            if (stage == 'selectPositivesFinal') {
                total = 2
            } else if (stage == 'selectCategoryCardsFinal') {
                total = 3
            }
            return total
        }

        function getSelectedCards() {
            return stage == 'selectCategoryCards' || stage == 'selectCategoryCardsFinal' ? selectedExpectations : selectedPositives

        }

        function cardsCounter() {

            let total = getSelectedCardsTotal()

            let selectedCards = getSelectedCards()

            let selectedCardsCounter = selectedCards.length
            cardsHeaderTitle.innerHTML = selectedCardsCounter + (total > 0 ? '/' + total : "")

            if (total) {
                if (selectedCardsCounter > total) {
                    cardsHeaderTitle.classList.add('text-danger')
                } else {
                    cardsHeaderTitle.classList.remove('text-danger')
                }
            }
        }

        function showCurrentExpectations() {
            allExpectationsGenerator()

            let cards = marriageGame.querySelectorAll('.categories-cards .card')

            cards.forEach((card) => {
                if (card.dataset.category == selectedCategory) {
                    card.classList.remove('d-none')
                } else {
                    card.classList.add('d-none')
                }
            })

        }

        function showCurrentCategoryCards() {
            stage = 'selectCategoryCards'

            gameTitle.innerHTML = 'Oczekiwania'
            gameTitleDesc.innerHTML = `Wybierz 3 karty, kt??re najbardziej pasuj?? do Twoich oczekiwa?? i b??dziesz chcia?? o nich porozmawia??.<br />Mo??esz zaznaczy?? wi??cej kart, na ko??cu dokonasz ostatecznego wyboru`
            gameContent.innerHTML = ""
            let dataTemp = [...selectedExpectations]

            showCurrentExpectations()
            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(3, selectedExpectations)
            // toggleSelectedFilterButton()

            marriageGame.querySelector('.categories-cards .cards-header h3').innerHTML = selectedExpectations.length

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showCategoriesCards()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (selectedExpectations.length != 3) {
                    showCurrentCategoryCardsFinal()
                } else {
                    if (!arrayEquals(dataTemp, selectedExpectations)) save_marriage_game_data('expectations', selectedExpectations)
                    showSortExpectations()
                }

            }, { once: true })


        }

        function showCurrentCategoryCardsFinal() {
            stage = 'selectCategoryCardsFinal'

            gameTitle.innerHTML = 'Wybierz ostatecznie 3 oczekiwania'
            gameTitleDesc.innerHTML = ''
            gameContent.innerHTML = ""
            let dataTemp = [...selectedExpectations]

            showCurrentExpectations()
            toggleSelectedCards()
            cardsCounter()

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(3, selectedExpectations, true)
            // toggleSelectedFilterButton()

            marriageGame.querySelector('.categories-cards .cards-header h3').innerHTML = selectedExpectations.length + '/3'

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showCurrentCategoryCards()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (!arrayEquals(dataTemp, selectedExpectations)) save_marriage_game_data('expectations', selectedExpectations)
                showSortExpectations()
            }, { once: true })


        }

        function showSortExpectations() {
            stage = 'sortExpectations'

            gameTitle.innerHTML = 'Posortuj oczekiwania'
            gameTitleDesc.innerHTML = 'U?????? karty w kolejno??ci od najmniej wa??nej do najwa??niejszej'
            gameContent.innerHTML = ""
            let dataTemp = [...selectedExpectations]

            selectedCardsGenerator(selectedExpectations, 'selected-expectations')

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(3, selectedExpectations)

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showCurrentCategoryCards()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (!arrayEquals(dataTemp, selectedExpectations)) save_marriage_game_data('expectations', selectedExpectations)
                showVoiceCardBreak()
            }, { once: true })

        }

        function remove_all_nextBtn_event_listeners() {
            let new_element = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(new_element, nextBtn);
            nextBtn = marriageGame.querySelector('.game-footer .next')
        }

        function remove_all_prevBtn_event_listeners() {
            let new_element = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(new_element, prevBtn);
            prevBtn = marriageGame.querySelector('.game-footer .before')
        }

        function showCurrentPositives() {
            allExpectationsGenerator()
            let cards = marriageGame.querySelectorAll('.categories-cards .card')

            cards.forEach((card) => {
                if (card.dataset.category == 'pozytywy') {
                    card.classList.remove('d-none')
                } else {
                    card.classList.add('d-none')
                }
            })
        }

        function showPositivesCards() {
            stage = 'selectPositives'

            gameTitle.innerHTML = 'Zaczynamy ????<br/><small>Pozytywy</small>'
            gameTitleDesc.innerHTML = `Wybierz 2 karty, na kt??rych b??dzie to co chcesz ${texts.partner_user_gender == "M" ? 'jemu' : 'jej'} <strong>mi??ego powiedzie??</strong>.<br />Mo??esz zaznaczy?? wi??cej kart, a na ko??cu dokona?? ostatecznego wyboru.`
            gameContent.innerHTML = ""
            let dataTemp = [...selectedPositives]

            showCurrentPositives()

            hideBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(2, selectedPositives)
            // toggleSelectedFilterButton()

            marriageGame.querySelector('.categories-cards .cards-header h3').innerHTML = selectedPositives.length



            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {

                if (selectedPositives.length != 2) {
                    showPositivesCardFinal()
                } else {
                    if (!arrayEquals(dataTemp, selectedPositives)) save_marriage_game_data('positives', selectedPositives)
                    showSortPositives()
                }

            }, { once: true })

        }

        function showPositivesCardFinal() {
            stage = 'selectPositivesFinal'
            // marriageGame.querySelector('.categories-cards').classList.add('d-none')
            // marriageGame.querySelector('.selected-expectations').classList.add('d-none')

            gameTitle.innerHTML = 'Wybierz ostatecznie 2 pozytywy'
            // gameTitleDesc.innerHTML = 'Zaznacz maksymalnie 2 pozytywy'
            gameTitleDesc.innerHTML = ''
            // gameContent.innerHTML = ""

            let dataTemp = [...selectedPositives]

            toggleSelectedCards()
            cardsCounter()

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(2, selectedPositives, true)

            marriageGame.querySelector('.categories-cards .cards-header h3').innerHTML = selectedPositives.length + '/2'

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {

                showPositivesCards()

            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (!arrayEquals(dataTemp, selectedPositives)) save_marriage_game_data('positives', selectedPositives)

                showSortPositives()

            }, { once: true })


        }

        function showSortPositives() {
            stage = 'sortPositives'
            // marriageGame.querySelector('.categories-cards').classList.add('d-none')
            // marriageGame.querySelector('.selected-expectations').classList.add('d-none')

            gameTitle.innerHTML = 'Posortuj pozytywy'
            gameTitleDesc.innerHTML = 'U?????? Karty w kolejno??ci od najmniej wa??nej do najwa??niejszej'
            gameContent.innerHTML = ""
            let dataTemp = [...selectedPositives]

            selectedCardsGenerator(selectedPositives, 'selected-positives')

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtnState(2, selectedPositives)

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showPositivesCards()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (!arrayEquals(dataTemp, selectedPositives)) save_marriage_game_data('positives', selectedPositives)
                showCategoriesCards()
            }, { once: true })

        }

        function showVoiceCardBreak() {
            stage = 'voiceCardBreak'
            // marriageGame.querySelectorAll('.cards').forEach((card) => {
            //     card.classList.add('d-none')
            // })

            gameTitle.innerHTML = 'Karta G??osu'
            gameTitleDesc.innerHTML = `Posiadanie <strong>Karty G??osu</strong> b??dzie oznacza??, ??e masz <strong>prawo m??wienia</strong>. ${texts.partner_name} nie b??dzie mog???? w tym czasie odzywa?? si??, dopowiada?? ani komentowa??. Za z??amanie tej zasady poniesie ustalone konsekwencje.`
            // gameTitleDesc.innerHTML = `Przedyskutuj, ustal i wpisz konsekwencje, je??li ${texts.partner_name}  z??amie zasady Karty G??osu`
            gameContent.innerHTML = `Wpisz konsekwencje, jakie ${texts.partner_name} poniesie za z??amanie zasady Karty G??osu:`

            let dataTemp = voiceCardBreak

            const cardBreakWrapOld = marriageGame.querySelector('.voice-card-break')
            if (exist(cardBreakWrapOld)) cardBreakWrapOld.remove()

            const cardBreakWrap = document.createElement('div')
            cardBreakWrap.classList = 'voice-card-break mt-2'

            const breakText = document.createElement('textarea')
            breakText.classList = 'form-control'
            breakText.value = voiceCardBreak

            if (voiceCardBreak) {
                nextBtn.disabled = false
            } else {
                nextBtn.disabled = true
            }

            cardBreakWrap.appendChild(breakText)
            gameContent.appendChild(cardBreakWrap)

            showBtn(prevBtn)
            showBtn(nextBtn)
            nextBtn.innerHTML = 'Dalej'

            breakText.addEventListener('keyup', function () {
                voiceCardBreak = this.value
                if (voiceCardBreak) {
                    nextBtn.disabled = false
                } else {
                    nextBtn.disabled = true
                }
            })

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showSortExpectations()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (dataTemp != voiceCardBreak) save_marriage_game_data('voice_card_break', voiceCardBreak)
                showSummaryBeforeStart()
            }, { once: true })

        }

        function showSummaryBeforeStart() {
            stage = 'summaryBeforeStart'

            gameTitle.innerHTML = 'Twoje karty'
            gameTitleDesc.classList.add('d-none')
            // gameTitleDesc.innerHTML = 'Z takimi ustawieniami rozpoczniesz now?? gr??'
            gameContent.innerHTML = ""


            const cardBreakWrap = document.createElement('div')
            cardBreakWrap.classList = 'summary-before-start'


            const selectedCategoryObj = categories.find(cat => { return cat.slug == selectedCategory })


            let sumContent = ''
            // sumContent += '<span class="badge badge-pill badge-dark mb-2">Wybrana kategoria</span>'

            sumContent += `<h3>${selectedCategoryObj.name}</h3>`

            const selectedPositivesArr = expectations.filter(el => selectedPositives.includes(el.id));
            const selectedExpectationsArr = expectations.filter(el => selectedExpectations.includes(el.id));

            // sumContent += `<h3>Wybrane karty</h3>`
            // sumContent += '<span class="badge badge-pill badge-dark mb-2">Wybrane karty</span>'

            sumContent += `<div class="cards"><div class="cards-content"><div class="cards-inner">`
            sumContent += `<div class="card">${selectedPositivesArr[0].title}</div>`

            selectedExpectationsArr.forEach(expectation => {
                sumContent += `<div class="card">${expectation.title}</div>`
            })

            sumContent += `<div class="card mb-1">${selectedPositivesArr[1].title}</div>`
            sumContent += `</div></div></div>`

            sumContent += '<span class="badge badge-pill badge-warning mb-2 mt-4">Konsekwencje za z??amanie zasady Karty G??osu</span>'

            sumContent += `<p class="small mt-2 mb-2">${texts.partner_name}:</p>`
            sumContent += `<div class="card bg-info">${voiceCardBreak}</div>`

            if (partnerVoiceCardBreak) {
                sumContent += `<p class="small mt-3 mb-2">${texts.user_name}:</p>`
                sumContent += `<div class="card bg-info">${partnerVoiceCardBreak}</div>`
            }

            cardBreakWrap.innerHTML = sumContent

            gameContent.appendChild(cardBreakWrap)

            showBtn(prevBtn)
            showBtn(nextBtn)

            nextBtn.innerHTML = 'Rozpocznij Gr??'

            // nextBtnState(3, selectedExpectations)

            remove_all_prevBtn_event_listeners()
            prevBtn.addEventListener('click', function () {
                showVoiceCardBreak()
            }, { once: true })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                showPartnerWaitingBeforeStart()
                save_marriage_game_data('stage', stage)

            }, { once: true })

        }



        function showPartnerWaitingBeforeStart() {
            stage = 'partnerWaitingBeforeStart'
            gameTitle.classList.add('d-none')
            gameTitleDesc.classList.add('d-none')
            gameContent.innerHTML = ""

            gameTop = document.createElement('div')
            gameTop.classList = 'game-top'

            gameTopUser = document.createElement('div')
            gameTopUser.classList = 'game-top-user'
            gameTopUser.innerHTML = `<small>${texts.user_name}</small><br />`


            gameTopUserCategory = document.createElement('span')
            gameTopUserCategory.classList = 'game-top-partner-category'
            gameTopUserCategory.innerHTML = `${categories.find(el => el.slug == selectedCategory).name}`
            gameTopUser.appendChild(gameTopUserCategory)



            gameTopPartner = document.createElement('div')
            gameTopPartner.classList = 'game-top-partner'
            gameTopPartner.innerHTML = `<small>${texts.partner_name}</small><br />`


            gameTopPartnerCategory = document.createElement('span')
            gameTopPartnerCategory.classList = 'game-top-partner-category'
            gameTopPartnerCategory.innerHTML = 'Czekamy...'
            gameTopPartner.appendChild(gameTopPartnerCategory)


            gameTopInfo = document.createElement('div')
            gameTopInfo.classList = 'game-top-info'
            gameTopInfo.innerHTML = ``


            setTopCategories()

            gameTop.appendChild(gameTopUser)
            showGameTopStatus()
            gameTop.appendChild(gameTopPartner)

            gameHeader.appendChild(gameTop)
            gameHeader.appendChild(gameTopInfo)
            gameHeader.classList.add('p-0')
            showGameTable()

            if (partnerStartStage != 'partnerWaitingBeforeStart' && partnerStartStage != 'marriageGameStarted') {
                const waitingText = document.createElement('h3')
                waitingText.classList = 'game-waiting'
                waitingText.innerHTML = `Czekamy, a?? ${texts.partner_name} rozpocznie gr??<br />${texts.spinner}`
                gameTable.insertBefore(waitingText, gameTable.firstChild);
            } else {
                if (currentCard.id) {
                    set_current_game_flow()
                } else {
                    showDrawPlayer()
                }

            }


            hideBtn(prevBtn)
            hideBtn(nextBtn)

            remove_all_prevBtn_event_listeners()
            remove_all_nextBtn_event_listeners()

        }

        function setTopCategories() {

            if (gameTopPartnerCategory) {
                let cat = ''

                if (currentCard.positive) {
                    cat = 'Pozytyw'
                } else {
                    cat = partnerSelectedCategory ? `${categories.find(el => el.slug == partnerSelectedCategory).name}` : ''
                }

                if (gameTopPartnerCategory.innerHTML != cat) gameTopPartnerCategory.innerHTML = cat
            }

            if (gameTopUserCategory) {
                let cat = ''

                if (currentCard.positive) {
                    cat = 'Pozytyw'
                } else {
                    cat = selectedCategory ? `${categories.find(el => el.slug == selectedCategory).name}` : ''
                }

                if (gameTopUserCategory.innerHTML != cat) gameTopUserCategory.innerHTML = cat
            }
        }

        function showGameTopStatus() {
            const wrapper_class = 'game-top-status'

            const oldEl = marriageGame.querySelector(`.${wrapper_class}`)
            if (exist(oldEl)) oldEl.remove()

            gameTopStatus = document.createElement('div')
            gameTopStatus.classList = wrapper_class
            setGameTopStatus()
            gameTop.appendChild(gameTopStatus)
        }

        function setGameTopStatus() {
            if (!gameTopStatus) return
            let cardsCounter = 0

            if (currentCard.key != null) {


                if (startUser == texts.current_user_type) {
                    if (currentCard.mine) {
                        if (currentCard.positive) {
                            cardsCounter = currentCard.key == 0 ? 1 : 9;
                        } else {
                            cardsCounter = currentCard.key * 2 + 3;
                        }
                    } else if (!currentCard.mine) {
                        if (currentCard.positive) {
                            cardsCounter = currentCard.key == 0 ? 2 : 10;
                        } else {
                            cardsCounter = currentCard.key * 2 + 4;
                        }
                    }
                } else {
                    if (currentCard.mine) {
                        if (currentCard.positive) {
                            cardsCounter = currentCard.key == 0 ? 2 : 10;
                        } else {
                            cardsCounter = currentCard.key * 2 + 4;
                        }
                    } else if (!currentCard.mine) {
                        if (currentCard.positive) {
                            cardsCounter = currentCard.key == 0 ? 1 : 9;
                        } else {
                            cardsCounter = currentCard.key * 2 + 3;
                        }
                    }
                }
            }



            gameTopStatus.innerHTML = `<small>Karta</small><br /> ${cardsCounter} z 10`
        }

        function showGameTable() {

            // //only fo tests
            // voiceCardCurrent = texts.current_user_type;

            stage = 'marriageGameStarted'
            save_marriage_game_data('stage', stage)

            gameTable = document.createElement('div')
            gameTable.classList = 'game-table'
            // gameTable.innerHTML = `<h3>Czekamy, a?? ${texts.partner_name} rozpocznie gr??</h3><p></p>`
            // gameTable.innerHTML = `${texts.spinner}`

            gameContent.appendChild(gameTable)
            // showCardsNav()


        }

        function showDrawPlayer() {

            // specialCardsWrap = document.createElement('div')
            // specialCardsWrap.classList = 'draw-player'

            drawPlayerBtn = document.createElement('button')
            drawPlayerBtn.classList = 'btn btn-dark btn-lg voice-card-draw'
            drawPlayerBtn.innerHTML = 'Losuj kart?? g??osu';

            drawWait = document.createElement('div')
            drawWait.classList = 'd-none mb-5'
            drawWait.innerHTML = texts.spinner;

            gameTable.appendChild(drawWait)
            gameTable.appendChild(drawPlayerBtn)

            drawPlayerBtn.addEventListener('click', function (e) {
                this.disabled = true
                drawWait.classList.remove('d-none')

                setTimeout(() => {
                    drawWait.classList.add('d-none')
                    this.disabled = false
                    let drawResult = Math.floor(Math.random() * 2 + 1);

                    if (drawResult == 1) {
                        voiceCardCurrent = texts.current_user_type
                        setCurrentCard(parseInt(selectedPositives[0]))
                    } else {
                        voiceCardCurrent = texts.partner_user_type
                        setCurrentCard(parseInt(partnerSelectedPositives[0]))
                    }

                    startUser = voiceCardCurrent

                    set_current_game_flow()
                    showStartPopup()
                    saveGame()
                    drawPlayerBtn.remove()
                    drawWait.remove()
                }, (Math.random() * 2 + 1) * 1000)

            }, { once: true })

        }

        function set_current_game_flow() {
            if (currentCard.id) {

                if (drawPlayerBtn) drawPlayerBtn.remove()
                if (drawWait) drawWait.remove()



                // showCurrentCardInfo1()
                showSpecialCardsInfo()
                showCurrentCard()
                // showCurrentCardInfo2()
                showVoiceCardGiveBtn()

                showSpecialCardsTitle()
                showSpecialCards()
                // showVoiceCard()

                setGameTopStatus()
                setTopCategories()

                showPrevCardBtn()
                showNextCardBtn()

            }
        }


        function showSpecialCardsInfo() {
            if (specialCardsInfo) specialCardsInfo.remove()

            const wrapper_class = 'special-card-info-btn'



            specialCardsInfo = document.createElement('button')
            specialCardsInfo.classList = 'btn btn-lg p-1 ml-auto mt-auto mb-0 ' + wrapper_class


            specialCardsInfo.innerHTML = '<i class="fa fa-question-circle"></i>';

            specialCardsInfo.addEventListener('click', function (e) {

                specialCardCurrent = 'instrukcja'

                showSpecialCardPopup()

            })

            gameTable.appendChild(specialCardsInfo);

        }

        function showCurrentCard() {
            if (currentCardWrap) currentCardWrap.remove()

            const wrapper_class = 'current-card'

            const card = expectations.find(el => el.id == currentCard.id);

            currentCardWrap = document.createElement('div')
            currentCardWrap.classList = '' + wrapper_class
            currentCardWrap.innerHTML = card.title;

            gameTable.appendChild(currentCardWrap);

        }

        function showCurrentCardInfo1() {
            if (currentCardInfo) currentCardInfo.remove()

            const wrapper_class = 'current-card-info'

            currentCardInfo = document.createElement('div')
            currentCardInfo.classList = 'cards-info mt-auto ' + wrapper_class

            // if (hasVoiceCard() && currentCard.mine && currentCard.positive) {
            //     currentCardInfo.innerHTML = 'Przeczytaj na g??os:';
            // } else 

            if (currentCard.mine) {
                if (currentCard.positive) {
                    currentCardInfo.innerHTML = `Tw??j pozytyw ${currentCard.key + 1} z 2`;
                } else {
                    currentCardInfo.innerHTML = `Twoje oczekiwanie ${currentCard.key + 1} z 3`;
                }
            } else if (!currentCard.mine) {
                currentCardInfo.innerHTML = `${texts.partner_name} - oczekiwanie ${currentCard.key + 1} z 2`;
                if (currentCard.positive) {
                    currentCardInfo.innerHTML = `${texts.partner_name} - pozytyw ${currentCard.key + 1} z 2`;
                } else {
                    currentCardInfo.innerHTML = `${texts.partner_name} - oczekiwanie ${currentCard.key + 1} z 3`;
                }
            }

            gameTable.appendChild(currentCardInfo);
        }

        function showCurrentCardInfo2() {
            if (currentCardInfo2) currentCardInfo2.remove()

            const wrapper_class = 'current-card-info2'

            currentCardInfo2 = document.createElement('div')
            currentCardInfo2.classList = 'cards-info ' + wrapper_class

            if (hasVoiceCard()) {
                if (currentCard.mine && currentCard.positive) {
                    currentCardInfo2.innerHTML = 'W razie potrzeby dopowiedz komentarz do swojego pozytywu<br />lub<br />przeka?? Kart?? G??osu.';
                } else {
                    currentCardInfo2.innerHTML = `Mo??esz m??wi??. ${texts.partner_name} nie mo??e Ci przerywa??. <br />Kiedy sko??czysz, przeka?? Kart?? G??osu.`;
                }
            } else {
                currentCardInfo2.innerHTML = `${texts.partner_name} m??wi, wys??uchaj ${texts.partner_user_gender == 'M' ? 'go' : 'j??'} i poczekaj na Kart?? G??osu`;
            }
            gameTable.appendChild(currentCardInfo2);
        }



        function showVoiceCard() {
            if (voiceCard) voiceCard.remove()
            const wrapper_class = 'voice-card'

            voiceCard = document.createElement('div')
            voiceCard.classList = 'mt-auto ' + wrapper_class

            voiceCardActiveToggle()

            voiceCard.innerHTML = 'Karta g??osu';
            gameTable.appendChild(voiceCard);
        }

        function showVoiceCardGiveBtn() {
            if (voiceCardBtn) voiceCardBtn.remove()
            const wrapper_class = 'voice-card-give'

            voiceCardBtn = document.createElement('button')
            voiceCardBtn.classList = 'btn btn-warning mt-3 mb-auto ' + wrapper_class

            voiceCardBtnActiveToggle()

            if (isLastCard()) {
                voiceCardBtn.innerHTML = 'Ustalcie postanowienie';
            } else {

                voiceCardBtn.innerHTML = currentCard.positive ? `Przeka?? kart?? g??osu<br /> + <br />poka?? nast??pn?? kart??` : 'Przeka?? kart?? g??osu'
            }

            gameTable.appendChild(voiceCardBtn);

            voiceCardBtn.addEventListener('click', function (e) {
                this.disabled = true
                voiceCardToPartner()
            })


        }

        function showSpecialCards() {
            if (specialCardsWrap) specialCardsWrap.remove()

            const wrapper_class = 'special-cards'

            specialCardsWrap = document.createElement('div')
            specialCardsWrap.classList = wrapper_class

            specialCardsActiveToggle()

            specialCards.forEach(specialCard => {
                if (specialCard.type == 'hidden') return
                const card = document.createElement('div')
                card.classList = 'special-card ' + specialCard.type
                card.innerHTML = specialCard.name
                specialCardsWrap.appendChild(card)

                card.addEventListener('click', function (e) {
                    specialCardCurrent = specialCard.slug
                    // if (specialCardCurrent == 'sprawdzam') voiceCardToPartner()
                    showSpecialCardPopup()
                    save_marriage_game_data('special_card', specialCardCurrent)


                })

            })

            gameTable.appendChild(specialCardsWrap)
        }

        function showSpecialCardsTitle() {
            const wrapper_class = 'special-cards-info'

            if (specialCardsTitle) specialCardsTitle.remove()

            specialCardsTitle = document.createElement('div')
            specialCardsTitle.classList = 'cards-info mt-auto pt-3 ' + wrapper_class

            specialCardsTitle.innerHTML = 'Mo??esz r??wnie?? skorzysta?? z Kart Specjalnych:';
            // gameTable.insertBefore(specialCardsTitle, specialCardsWrap);
            gameTable.appendChild(specialCardsTitle)
        }

        function showStartPopup() {
            if (startPopupShown) return

            const wrapper_class = 'start-popup'

            if (startPopup) {
                jQuery('.start-popup').modal('hide')
                jQuery('.start-popup').modal('dispose')
                startPopup.remove()
            }


            startPopup = document.createElement('div')
            startPopup.classList = "modal " + wrapper_class
            startPopup.setAttribute("tabindex", "-1")
            startPopup.setAttribute("tabindex", "-1")
            startPopup.setAttribute("aria-labelledby", "staticBackdropLabel")
            startPopup.setAttribute("aria-hidden", true)

            document.body.appendChild(startPopup);

            startPopup.innerHTML =
                `
                    <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header ">
                    <h4 class="modal-title">Modal title</h4>
                  </div>
                  <div class="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div class="modal-footer">
                  <div class="waiting-info">
                  </div>
                  </div>
                </div>
              </div>
              `;

            dismissStartGamePopup = document.createElement('button')
            dismissStartGamePopup.classList = "btn btn-primary"
            dismissStartGamePopup.setAttribute("type", "button")
            dismissStartGamePopup.innerHTML = `OK`

            let dismissPopup = document.createElement('button')
            dismissPopup.classList = "btn btn-secondary game-tutorial-disable"
            dismissPopup.setAttribute("type", "button")
            dismissPopup.innerHTML = `Nie pokazuj wi??cej`



            let bodyText = ''

            if (texts.game_tutorial_block) {
                startGameWhoStart()
            } else {

                dismissPopup.addEventListener('click', function (e) {
                    save_marriage_game_data('game_tutorial_disable', true)
                    dismissPopup.remove()
                    startGameWhoStart()
                })
                startPopup.querySelector('.modal-footer').appendChild(dismissPopup)

                bodyText = `Gra polega na <strong>wsp??lnej rozmowie</strong> na temat wybranych kart. Karty b??d?? wy??wietla?? si?? naprzemiennie. Do dyspozycji b??dziecie mieli tzw. <strong>Karty Specjalne</strong>, kt??re pomog?? Wam w zastosowaniu prawid??owych regu?? komunikacji. <br />??yczymy powodzenia!`
                startPopup.querySelector('.modal-body').innerHTML = bodyText;
            }

            startPopup.querySelector('.modal-footer').appendChild(dismissStartGamePopup)



            startPopup.querySelector('.modal-title').innerHTML = `Rozpoczynamy Gr?? Relate`;

            startPopup.querySelector('.modal-footer button').classList.remove('d-none');

            startPopupShown = true
            jQuery('.start-popup').modal('show')



            dismissStartGamePopup.addEventListener('click', function (e) {
                console.log('Jestem')
                if (this.classList.contains('dismiss')) {
                    jQuery('.start-popup').modal('hide')
                    jQuery('.start-popup').modal('dispose')
                    startPopup.remove()
                } else {
                    dismissPopup.remove()
                    startGameWhoStart()
                }
            })

        }

        function startGameWhoStart() {
            if (currentCard.mine) {
                bodyText = `${texts.current_user_gender == 'M' ? 'Wylosowa??e??' : 'Wylosowa??a??'} Kart?? G??osu, wi??c Gr?? rozpoczynamy od Twojej karty.`
            } else {
                bodyText = `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'wylosowa??' : 'wylosowa??a'} Kart?? G??osu, wi??c Gr?? rozpoczynamy od ${texts.partner_user_gender == 'M' ? 'jego' : 'jej'} karty.`
            }
            startPopup.querySelector('.modal-body').innerHTML = bodyText;
            dismissStartGamePopup.innerHTML = `Zaczynamy`
            console.log('Jestem2')
            dismissStartGamePopup.classList.add(`dismiss`)
        }

        function showSpecialCardPopup() {

            if (specialCardCurrent && specialCardCurrent != 'null') {

                const wrapper_class = 'special-card-popup'

                if (specialCardPopup) {
                    jQuery('.special-card-popup').modal('hide')
                    jQuery('.special-card-popup').modal('dispose')
                    specialCardPopup.remove()
                }

                specialCardPopup = document.createElement('div')
                specialCardPopup.classList = "modal " + wrapper_class
                specialCardPopup.dataset.backdrop = 'static'
                specialCardPopup.dataset.keyboard = false
                specialCardPopup.setAttribute("tabindex", "-1")
                specialCardPopup.setAttribute("tabindex", "-1")
                specialCardPopup.setAttribute("aria-labelledby", "staticBackdropLabel")
                specialCardPopup.setAttribute("aria-hidden", true)

                document.body.appendChild(specialCardPopup);

                specialCardPopup.innerHTML =
                    `
                    <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title">Modal title</h4>
 
                  </div>
                  <div class="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div class="modal-footer">
                  <div class="waiting-info">
                  </div>
                  </div>
                </div>
              </div>
              `;

                const dismissPopupHeader = document.createElement('button')
                dismissPopupHeader.classList = "close"
                dismissPopupHeader.setAttribute("type", "button")
                dismissPopupHeader.innerHTML = '<span aria-hidden="true">&times;</span>'

                dismissPopupHeader.addEventListener('click', function (e) {
                    hideSpecialCardPopup()
                })
                specialCardPopup.querySelector('.modal-header').appendChild(dismissPopupHeader)

                const dismissPopup = document.createElement('button')
                dismissPopup.classList = "btn btn-primary"
                dismissPopup.setAttribute("type", "button")

                if (specialCardCurrent == 'stop') {
                    dismissPopup.innerHTML = `Odblokuj`
                } else if (specialCardCurrent == 'instrukcja') {
                    dismissPopup.innerHTML = `Zamknij`
                } else {
                    dismissPopup.innerHTML = `OK`
                }


                dismissPopup.addEventListener('click', function (e) {
                    hideSpecialCardPopup()
                })

                specialCardPopup.querySelector('.modal-footer').appendChild(dismissPopup)



                let specialCard = specialCards.find(el => el.slug == specialCardCurrent)

                specialCardPopup.querySelector('.modal-title').innerHTML = specialCard.name;

                let sideType = specialCard.type == 'voice-card-active' && voiceCardCurrent == texts.partner_user_type || specialCard.type == 'voice-card-inactive' && voiceCardCurrent == texts.current_user_type ? true : false

                if (specialCardCurrent == 'instrukcja') {

                    // let modalBody = '<h2>Kiedy u??ywa??<br />Kart Specjalnych?</h2>'
                    // specialCards.forEach(card => {
                    //     if (card.info) modalBody += `<h4 class="mb-1">${card.name}</h4><p>${card.info}</p>`
                    // })
                    // specialCardPopup.querySelector('.modal-body').innerHTML = modalBody;


                    let modalBody = '<div class="accordion faqs" id="accordionCommunication">'
                    specialCardsInfoTexts.forEach(function (card, i) {
                        modalBody += `  <div class="faq">
                        <div class="faq-header" id="comunication_header_${card.slug}">
                          <h3 class="${i != 0 ? 'collapsed' : ''}" data-toggle="collapse" data-target="#comunication_${card.slug}" aria-expanded="true" aria-controls="comunication_${card.slug}">
                            ${card.name}                           
                          </h3>
                        </div>
                    
                        <div id="comunication_${card.slug}" class="collapse ${i == 0 ? 'show' : ''}" aria-labelledby="heading_${card.slug}" data-parent="#accordionCommunication">
                          <div class="card-body">
                          ${card.info}
                          </div>
                        </div>
                      </div>`

                        // modalBody += `<h4 class="mb-1">${card.name}</h4><p>${card.info}</p>`

                    })
                    modalBody += '</div>'

                    specialCardPopup.querySelector('.modal-body').innerHTML = modalBody;

                } else if (specialCardCurrent == 'wybierz-emocje') {
                    let modalBody = 'Emotki2'
                    specialCardPopup.querySelector('.modal-body').innerHTML = modalBody;

                } else {
                    specialCardPopup.querySelector('.modal-body').innerHTML = sideType ? specialCard.infoActive : specialCard.infoInactive;
                }

                if (sideType && specialCard.slug != 'stop' && specialCard.slug != 'instrukcja' || specialCard.slug == 'wybierz-emocje' || !sideType && (specialCard.slug == 'stop' || specialCard.slug == 'instrukcja')) {

                    if (specialCard.slug != 'instrukcja' && specialCard.slug != 'wybierz-emocje') notification.play();

                    specialCardPopup.querySelector('.modal-footer button').classList.remove('d-none');
                    specialCardPopup.querySelector('.modal-footer .waiting-info').classList.add('d-none');

                    if (specialCard.slug == 'wybierz-emocje') {
                        specialCardPopup.querySelector('.modal-footer button').addEventListener('click', function () {
                            console.log('jestem')
                            specialCardCurrent = 'moje-emocje'
                            showSpecialCardPopup()
                            save_marriage_game_data('special_card', specialCardCurrent)
                        }, { once: true })
                    }


                } else {
                    specialCardPopup.querySelector('.modal-footer button').classList.add('d-none');
                    specialCardPopup.querySelector('.modal-footer .waiting-info').innerHTML = `Poczekaj a?? ${texts.partner_name} zareaguje. <br />${texts.spinner}`;
                    specialCardPopup.querySelector('.modal-footer .waiting-info').classList.remove('d-none');
                }

                jQuery('.special-card-popup').modal('show')

            } else {
                jQuery('.special-card-popup').modal('hide')
            }

        }

        function hideSpecialCardPopup() {
            jQuery('.special-card-popup').modal('hide')
            jQuery('.special-card-popup').modal('dispose')
            specialCardPopup.remove()
            specialCardCurrent = null

            // this.classList.remove('selected')

            save_marriage_game_data('special_card', specialCardCurrent)
        }

        function showCardsNav() {
            const wrapper_class = 'cards-nav'
            if (exist(marriageGame.querySelector(`.${wrapper_class}`))) {
                return
            }

            cardsNav = document.createElement('div')
            cardsNav.classList = "mt-auto " + wrapper_class

            cardsNav.innerHTML = '<p class="cards-info mb-1">Je??li temat zosta?? wyczerpany, ods??o?? kolejn?? kart??.</p>';
            gameFooter.insertBefore(cardsNav, gameTable.firstChild);
        }

        function showPrevCardBtn() {
            const wrapper_class = 'prev-card-btn'
            if (exist(marriageGame.querySelector(`.${wrapper_class}`))) {
                prevCardBtnActiveToggle()
                return
            }

            prevCardBtn = document.createElement('button')
            prevCardBtn.classList = 'btn btn-primary btn-sm ml-auto started-game-btn ' + wrapper_class

            prevCardBtnActiveToggle()

            prevCardBtn.innerHTML = 'Poprzednia karta';

            gameFooter.appendChild(prevCardBtn);

            prevCardBtn.addEventListener('click', function (e) {
                this.disabled = true
                setNextCard()
                set_current_game_flow()
                saveGame()
            })

        }

        function showNextCardBtn() {
            const wrapper_class = 'next-card-btn'
            if (exist(marriageGame.querySelector(`.${wrapper_class}`))) {
                nextCardBtnActiveToggle()
                return
            }

            nextCardBtn = document.createElement('button')
            nextCardBtn.classList = 'btn btn-success btn-sm ml-auto started-game-btn ' + wrapper_class

            nextCardBtnActiveToggle()

            nextCardBtn.innerHTML = 'Nast??pna karta';

            gameFooter.appendChild(nextCardBtn);

            nextCardBtn.addEventListener('click', function (e) {
                this.disabled = true
                setNextCard()
                set_current_game_flow()
                saveGame()
            })

        }

        function setNextCard() {


            previousCard = currentCard
            if (currentCard.positive) {
                if (isLastCard()) {
                    showResolution()
                    return
                } else {

                    if (currentPlayerStartedGame()) {
                        setCurrentCard(partnerSelectedPositives[currentCard.key])
                    } else {
                        setCurrentCard(partnerSelectedExpectations[0])
                    }
                }
            } else {
                if (currentCard.mine) return

                if (currentPlayerStartedGame() && currentCard.key == 2) {
                    setCurrentCard(selectedPositives[1])
                } else if (currentCard.key <= 2) {
                    if (currentPlayerStartedGame()) {
                        setCurrentCard(selectedExpectations[currentCard.key + 1])
                    } else {
                        setCurrentCard(selectedExpectations[currentCard.key])
                    }
                }
            }
        }

        function isLastCard() {
            return currentCard.positive && currentCard.key == 1 && !currentPlayerStartedGame()
        }

        function endGame() {
            stage = 'endGame'
            save_marriage_game_data('stage', stage)

            gameTitle.innerHTML = 'Gra zako??czona'
            gameTitleDesc.classList.add('d-none')
            gameContent.innerHTML = "<h3>Gratulacje!</h3>Zako??czyli??cie pozytywnie Gr?? Relate. ??yczymy powodzenia w wype??nianiu postanowie?? i czekamy na kolejn?? rozgrywk??!"

            hideBtn(nextBtn)

            outBtn.classList.remove('btn-sm')
            outBtn.classList.add('btn-lg')
            outBtn.classList.add('ml-auto')
            outBtn.classList.add('mr-auto')

        }

        function showResolution() {
            stage = 'setResolution'
            save_marriage_game_data('stage', stage)

            marriageGame.querySelectorAll('.started-game-btn').forEach((el) => {
                el.remove()
            })
            gameHeader.classList.remove('p-0')
            gameTop.classList.add('d-none')
            gameTopInfo.classList.add('d-none')
            gameTitle.innerHTML = 'Twoje postanowienie'
            gameTitle.classList.remove('d-none')
            gameTitleDesc.innerHTML = `Wpisz postanowienie zwi??zane z tematem przeprowadzonej rozmowy. Ma to by?? <strong>konkret</strong>, kt??ry zrobisz w najbli??szym czasie <strong>dla ${texts.partner_user_gender == 'M' ? 'niego' : 'niej'}</strong> lub dla Waszego zwi??zku`
            gameTitleDesc.classList.remove('d-none')

            gameContent.innerHTML = ""

            let dataTemp = resolution

            const resolutionWrapOld = marriageGame.querySelector('.resolution')
            if (exist(resolutionWrapOld)) resolutionWrapOld.remove()

            const resolutionWrap = document.createElement('div')
            resolutionWrap.classList = 'resolution'

            const resolutionText = document.createElement('textarea')
            resolutionText.classList = 'form-control'
            resolutionText.value = resolution

            if (resolution != null) {
                nextBtn.disabled = false
            } else {
                nextBtn.disabled = true
            }

            resolutionWrap.appendChild(resolutionText)
            gameContent.appendChild(resolutionWrap)

            nextBtn.innerHTML = 'Zako??cz gr??'
            showBtn(nextBtn)

            resolutionText.addEventListener('keyup', function () {
                resolution = this.value
                if (resolution) {
                    nextBtn.disabled = false
                } else {
                    nextBtn.disabled = true
                }
            })

            remove_all_nextBtn_event_listeners()
            nextBtn.addEventListener('click', function () {
                if (dataTemp != resolution) save_marriage_game_data('resolution', resolution)
                endGame()
            }, { once: true })

        }

        function currentPlayerStartedGame() {
            return startUser == texts.current_user_type
        }

        function setCurrentCard(id) {

            currentCard.id = parseInt(id)
            currentCard.mine = currentCardMine()
            currentCard.positive = currentCardPositive()
            currentCard.key = currentCardKey()
        }

        function specialCardsActiveToggle() {
            if (!specialCardsWrap) return

            if (!hasVoiceCard()) {
                specialCardsWrap.classList.add('active')
            } else {
                specialCardsWrap.classList.remove('active')
            }
        }

        function voiceCardActiveToggle() {
            if (!voiceCard) return

            if (hasVoiceCard()) {
                if (!voiceCard.classList.contains('active')) {
                    voiceCard.classList.add('active')
                    notification.play();
                }
            } else {
                voiceCard.classList.remove('active')
            }
        }

        function voiceCardBtnActiveToggle() {
            if (!voiceCardBtn) return

            if (!hasVoiceCard()) {
                voiceCardBtn.disabled = true
            } else {
                voiceCardBtn.disabled = false
            }
        }
        function prevCardBtnActiveToggle() {
            if (!prevCardBtn) return

            if (!hasVoiceCard() || currentCard.positive || isLastCard() || hasVoiceCard() && currentCard.mine) {
                prevCardBtn.disabled = true
            } else {
                prevCardBtn.disabled = false
            }
        }
        function nextCardBtnActiveToggle() {
            if (!nextCardBtn) return

            if (!hasVoiceCard() || currentCard.positive || hasVoiceCard() && currentCard.mine) {
                nextCardBtn.disabled = true
            } else {
                nextCardBtn.disabled = false
            }
        }

        function hasVoiceCard() {
            if (voiceCardCurrent == texts.current_user_type) return true
            return false
        }


        function currentCardMine() {
            if (selectedPositives.includes(parseInt(currentCard.id)) || selectedExpectations.includes(parseInt(currentCard.id))) return true
            return false
        }

        function currentCardPositive() {
            if (selectedPositives.includes(parseInt(currentCard.id)) || partnerSelectedPositives.includes(parseInt(currentCard.id))) return true
            return false
        }

        function currentCardKey() {
            let cardKey = false

            if (currentCard.mine) {
                if (currentCard.positive) {
                    cardKey = Object.keys(selectedPositives).find(key => selectedPositives[key] == currentCard.id);
                } else {
                    cardKey = Object.keys(selectedExpectations).find(key => selectedExpectations[key] == currentCard.id);
                }
            } else {
                if (currentCard.positive) {
                    cardKey = Object.keys(partnerSelectedPositives).find(key => partnerSelectedPositives[key] == currentCard.id);

                } else {
                    cardKey = Object.keys(partnerSelectedExpectations).find(key => partnerSelectedExpectations[key] == currentCard.id);
                }
            }

            return parseInt(cardKey)
        }

        function voiceCardToPartner() {

            if (!isLastCard()) voiceCardCurrent = texts.partner_user_type

            if (currentCard.positive && currentCard.mine) setNextCard()

            toggleTopVoiceCard()

            if (!isLastCard()) set_current_game_flow()
            saveGame()
        }

        function toggleTopVoiceCard() {
            if (!gameTopUser || !gameTopPartner || !voiceCardCurrent) return

            if (hasVoiceCard()) {
                gameTopUser.classList.add('has-voice-card')
                gameTopPartner.classList.remove('has-voice-card')

                gameTopInfo.classList.add('has-voice-card')
                gameTopInfo.innerHTML = `M??wisz`

            } else {
                gameTopUser.classList.remove('has-voice-card')
                gameTopPartner.classList.add('has-voice-card')

                gameTopInfo.classList.remove('has-voice-card')
                gameTopInfo.innerHTML = `S??uchasz`

            }
        }

        function saveGame() {
            let data = {
                voiceCardCurrent: voiceCardCurrent,
                currentCard: currentCard.id,
                startUser: startUser
            }
            save_marriage_game_data('save-game', JSON.stringify(data))
        }

        function selectedCardsGenerator(selected, className) {
            const categoriesWrap = document.createElement('div')
            categoriesWrap.classList = className + ' cards'

            const cards = document.createElement('div')
            cards.classList = 'cards-content'

            const cardsInner = document.createElement('div')
            cardsInner.classList = 'cards-inner'

            selected.forEach((element) => {
                let exp = expectations.find(el => element == el.id);

                let card = document.createElement('div')
                card.classList = 'card'
                card.innerHTML = exp.title + '<i class="fa fa-fw fa-sort"></i>'
                cardsInner.appendChild(card)
            })

            var sortable = Sortable.create(cardsInner, {
                onChange: function (evt) {
                    selected = arrayMoveElement(selected, evt.oldIndex, evt.newIndex)
                }
            });

            cards.appendChild(cardsInner)

            categoriesWrap.appendChild(cards)
            gameContent.appendChild(categoriesWrap)
        }

        function arrayMoveElement(arr, fromIndex, toIndex) {
            let element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
            return arr
        }

        function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        }

        function arrayEquals(a, b) {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

        function test_start() {
            selectedExpectations = [430, 428, 425]
            showSortExpectations()
            showPositivesCards()
            selectedPositives = [431, 429]
            showSortPositives()

            showVoiceCardBreak()
            voiceCardBreak = 'Testowa konsekwencja za z??amanie zasady Karty G??osu'
            marriageGame.querySelector('.voice-card-break').remove()

            showSummaryBeforeStart()

        }

        function setGameID() {
            showStartWaiting()

            const queryParams = new URLSearchParams(window.location.search)
            gameID = queryParams.get('game-id')

            let params = {
                'action': 'set_game_id',
                'nonce': gameSettings.nonce,
                'gameID': JSON.stringify(gameID)
            }

            let dataString = (new URLSearchParams(params)).toString()

            fetch(gameSettings.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: dataString,
                credentials: 'same-origin',
            })
                .then((response) => response.json())
                .then((data) => {
                    gameID = data.gameID

                    setVariables(data.game)

                    startGame()
                    queryParams.set('game-id', gameID)
                    history.replaceState(null, null, "?" + queryParams.toString())
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        function set_sse() {

            if (gameID) {
                const evtSource = new EventSource(gameSettings.ajax_url + '?action=sse' + '&nonce=' + gameSettings.nonce + '&game_id=' + gameID);
                let currentData = null
                let data = null

                evtSource.onmessage = function (e) {
                    if (currentData != e.data) {
                        currentData = e.data

                        data = JSON.parse(e.data)

                        console.table(data);

                        setVariables(data)
                        setTopCategories()

                        toggleTopVoiceCard()

                        if (stage == "marriageGameStarted" && data.special_card && data.special_card != 'instrukcja' && data.special_card != 'wybierz-emocje') showSpecialCardPopup()


                        if (stage == "marriageGameStarted" && voiceCardCurrent && currentCard.key == 0 && currentCard.positive) showStartPopup()



                        if (stage == "marriageGameStarted" && (data["user_stage"] == 'setResolution' || data["partner_stage"] == 'setResolution')) {
                            showResolution()
                            return
                        }

                        if (data["user_stage"] == 'marriageGameStarted' && data["partner_stage"] == 'marriageGameStarted') {
                            const gameWaiting = marriageGame.querySelector('.game-waiting')
                            if (exist(gameWaiting)) gameWaiting.remove()

                            if (!data["start_user"]) {
                                if (!drawPlayerBtn) showDrawPlayer()
                            } else {
                                set_current_game_flow()
                            }
                            return
                        }



                    }
                };

                // evtSource.onerror = function (e) {
                //     console.error(e);
                // };

                // window.addEventListener("beforeunload", function (e) {
                //     evtSource.close();
                // }, false);

                outBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    evtSource.close();
                    set_out_of_game();
                }, { once: true })

            } else {
                setTimeout(() => {
                    set_sse();
                }, 1000)
            }
        }


        function save_marriage_game_data(type, data) {
            let params = {
                'action': 'save_marriage_game_data',
                'nonce': gameSettings.nonce,
                'type': type,
                'data': data,
                'stage': stage,
                'gameID': gameID
            }

            let dataString = (new URLSearchParams(params)).toString()

            fetch(gameSettings.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: dataString,
                credentials: 'same-origin',
            })
                .then((response) => response.json())
                .then((data) => {
                    gameID = data.gameID;
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        function set_out_of_game() {
            let params = {
                'action': 'set_out_of_game',
                'nonce': gameSettings.nonce,
                'gameID': gameID
            }

            let dataString = (new URLSearchParams(params)).toString()

            fetch(gameSettings.ajax_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: dataString,
                credentials: 'same-origin',
            })
                .then((response) => response.json())
                .then((data) => {
                    window.location = outBtn.href;
                })
                .catch((error) => {
                    console.error(error)

                })
        }

        function toggleCardFilterVisibility(card) {
            const filterBtn = card.closest('.cards').querySelector('.filter-selected-cards')
            console.log('clicked2')

            if (!filterBtn.classList.contains('filter-active')) return false
            if (card.classList.contains('selected')) return false

            setTimeout(() => {
                card.classList.add('d-none')
            }, 300)

        }

        function toggleSelectedCards() {
            cat = stage == 'selectCategoryCards' || stage == 'selectCategoryCardsFinal' ? selectedCategory : 'pozytywy'
            console.log(cat)
            const cards = marriageGame.querySelectorAll('.card[data-category=' + cat + ']')
            cards.forEach((card) => {

                if (!card.classList.contains('selected')) {
                    card.classList.toggle('d-none')
                }

            })
        }

        function toggleSelectedFilterButton() {
            const btn = marriageGame.querySelector('.filter-selected-cards')

            if (cardsFilterActive()) {
                btn.disabled = false
            } else {
                btn.disabled = true
            }
        }

        function cardsFilterActive() {
            const cards = marriageGame.querySelectorAll('.cards .card')

            if ([...cards].filter(el => el.classList.contains('selected') && !el.classList.contains('d-none')).length > 0) return true
            return false
        }

        function nextBtnState(total, selectedCards, equal = false) {
            if (!equal && selectedCards.length >= total || equal && selectedCards.length == total) {
                nextBtn.disabled = false
            } else {
                nextBtn.disabled = true
            }
        }

        function showBtn(btn) {
            btn.classList.remove('d-none')

        }

        function hideBtn(btn) {
            btn.classList.add('d-none')
        }

        function setVariables(data) {
            if (!data) return

            if (data[texts.current_user_type + '_category']) selectedCategory = data[texts.current_user_type + '_category']
            if (data[texts.partner_user_type + '_category']) partnerSelectedCategory = data[texts.partner_user_type + '_category']

            if (data[texts.current_user_type + '_stage']) startStage = data[texts.current_user_type + '_stage']
            if (data[texts.partner_user_type + '_stage']) partnerStartStage = data[texts.partner_user_type + '_stage']

            if (data[texts.current_user_type + '_expectations']) selectedExpectations = data[texts.current_user_type + '_expectations'].split(',').map(el => parseInt(el))
            if (data[texts.partner_user_type + '_expectations']) partnerSelectedExpectations = data[texts.partner_user_type + '_expectations'].split(',').map(el => parseInt(el))

            if (data[texts.current_user_type + '_positives']) selectedPositives = data[texts.current_user_type + '_positives'].split(',').map(el => parseInt(el))
            if (data[texts.partner_user_type + '_positives']) partnerSelectedPositives = data[texts.partner_user_type + '_positives'].split(',').map(el => parseInt(el))

            if (data[texts.current_user_type + '_voice_card_break']) voiceCardBreak = data[texts.current_user_type + '_voice_card_break']
            if (data[texts.partner_user_type + '_voice_card_break']) partnerVoiceCardBreak = data[texts.partner_user_type + '_voice_card_break']

            if (data[texts.current_user_type + '_resolution']) resolution = data[texts.current_user_type + '_resolution']
            if (data[texts.partner_user_type + '_resolution']) partnerResolution = data[texts.partner_user_type + '_resolution']

            if (data.special_card) specialCardCurrent = data.special_card
            if (data.voice_card_current) voiceCardCurrent = data.voice_card_current
            if (data.start_user) startUser = data.start_user
            if (data.current_card) setCurrentCard(parseInt(data.current_card))

        }

        Object.defineProperty(String.prototype, 'capitalize', {
            value: function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            },
            enumerable: false
        });

        function showStartWaiting() {
            const wrapper_class = 'start-waiting'
            if (exist(marriageGame.querySelector(`.${wrapper_class}`))) {
                return
            }

            waitingStart = document.createElement('div')
            waitingStart.classList = wrapper_class

            waitingStart.innerHTML = texts.spinner;
            marriageGame.appendChild(waitingStart);

        }

        async function startGame() {
            console.log('Start game')

            await getCards()
            showPositivesCards()


            startStageCondition: if (startStage) {
                showSortPositives()
                if (startStage == 'selectPositives') break startStageCondition
                if (startStage == 'selectPositivesFinal') break startStageCondition

                showCategoriesCards()
                if (startStage == 'sortPositives') break startStageCondition

                showCurrentCategoryCards()
                if (startStage == 'selectCategory') break startStageCondition

                showSortExpectations()
                if (startStage == 'selectCategoryCards') break startStageCondition
                if (startStage == 'selectCategoryCardsFinal') break startStageCondition

                showVoiceCardBreak()
                if (startStage == 'sortExpectations') break startStageCondition

                showSummaryBeforeStart()
                if (startStage == 'voiceCardBreak') break startStageCondition

                if (startStage == 'summaryBeforeStart') break startStageCondition

                showPartnerWaitingBeforeStart()
                if (startStage == 'partnerWaitingBeforeStart') break startStageCondition

                if (startStage == 'marriageGameStarted') break startStageCondition

                showResolution()
                if (startStage == 'setResolution') break startStageCondition

                endGame()
                if (startStage == 'endGame') break startStageCondition

            }

            waitingStart.remove()

            set_sse()
        }

        keepWake()
        async function keepWake() {
            let lock

            try {
                lock = await navigator.wakeLock.request('screen');
            } catch (err) {
                // Error or rejection
                console.log('Wake Lock error: ', err);
            }
        }

    } else {
        alert('Przegl??darka nie jest kompatybilna z Gr?? Relate')
    }
}