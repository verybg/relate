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
            { 'name': 'Teściowie', 'slug': 'tesciowie' },
            { 'name': 'Praca', 'slug': 'praca' }
        ]

        var specialCards = [
            {
                'name': 'Przerywasz', 'slug': 'przerywasz', 'type': 'voice-card-active',
                'infoActive': `${texts.current_user_gender == 'M' ? 'Przerwałeś jej' : 'Przerwałaś mu'} wypowiedź nie mając Karty Głosu. Ponosisz wcześniej ustalone konsekwencje.`,
                'infoInactive': `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'przerwał' : 'przerwała'} Ci wypowiedź nie mając Karty Głosu. Ponosi wcześniej ustalone konsekwencje.`,
                'info': `Jeżeli ${texts.partner_name} przerwie Ci wypowiedź nie mając Karty Głosu, wciśnij kartę <strong>Przerywasz</strong>`
            },
            {
                'name': 'Sprawdzam', 'slug': 'sprawdzam', 'type': 'voice-card-active',
                'infoActive': `Zanim powiesz co o tym myślisz, musisz powiedzieć co ${texts.current_user_gender == 'M' ? 'usłyszałeś' : 'usłyszałaś'}, czyli jak rozumiesz ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} oczekiwania. Dopiero kiedy ${texts.partner_name} potwierdzi, że właśnie to ${texts.current_user_gender == 'M' ? 'chciała' : 'chciał'} powiedzieć możesz przejść do komentarza ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} oczekiwania.`,
                'infoInactive': `${texts.partner_name} ma za zadanie powiedzieć własnym słowami jak rozumie Twoje oczekiwanie. Bez potwierdzenia, że o to Ci chodziło nie może powiedzieć co o tym myśli.`,
                'info': `Jeżeli chcesz, aby ${texts.partner_name} powiedziała własnymi słowami jak rozumie Twoje oczekiwania.`
            },
            {
                'name': 'Tak, ale...', 'slug': 'tak-ale', 'type': 'voice-card-inactive',
                'infoActive': `${texts.current_user_gender == 'M' ? 'Użyłeś' : 'Użyłaś'} słów „tak, ale”, co może oznaczać, że zmieniasz temat, odbijasz piłeczkę, lub próbujesz się usprawiedliwić. Zacznij jeszcze raz, spróbuj wsłuchać się w oczekiwania, jakie ma ${texts.partner_name} i zrozumieć ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} perspektywę.`,
                'infoInactive': `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'użył' : 'użyła'} słów „tak, ale”. ${texts.partner_user_gender == 'M' ? 'Jego' : 'Jej'} zadaniem jest zmiana sposobu wypowiedzi, bez zmiany tematu i tzw. „odbijania piłeczki”.`,
                'info': `Jeżeli ${texts.partner_name} użyje słów „Tak, ale”.`
            },
            {
                'name': 'Mów o sobie', 'slug': 'mow-o-sobie', 'type': 'voice-card-inactive',
                'infoActive': `Mówisz o ${texts.partner_user_gender == 'M' ? 'nim' : 'niej'}, np. ${texts.current_user_gender == 'M' ? 'jaka' : 'jaki'} jest, co robi źle lub ${texts.current_user_gender == 'M' ? 'jaka powinna' : 'jaki powinien'} być. Spróbuj mówić o sobie i swoich odczuciach w związku z omawianą sprawą.`,
                'infoInactive': `${texts.partner_name} nie mówi o sobie. ${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest zmiana sposobu wypowiedzi tak, żeby mówić o sobie i swoich odczuciach`,
                'info': `Jeżeli ${texts.partner_name} mówi o Tobie oceniając Cię lub udziela Ci rad. Np. „Ty ciągle…”, „Ty jesteś…”, „Zmień się” itp.`
            },
            {
                'name': 'Pozwól mi czuć', 'slug': 'pozwol-mi-czuc', 'type': 'voice-card-inactive',
                'infoActive': `Kwestionujesz ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} uczucia np. poprzez udzielanie rad, racjonalne tłumaczenie faktów, zaprzeczanie, że to co mówi nie jest prawdą. Spróbuj powstrzymać się od tego typu wypowiedzi, nie traktuj tego osobiście, uznaj ${texts.current_user_gender == 'M' ? 'jej' : 'jego'} prawo do przeżywania tych uczuć.`,
                'infoInactive': `${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest uznać Twoje uczucia, nie komentować ich i im nie zaprzeczać.`,
                'info': `Kiedy ${texts.partner_name} kwestionuje Twoje uczucia np. poprzez udzielanie rad lub tłumaczenie rzeczywistości tylko faktami. `
            },
            {
                'name': 'Fakty czy wyobrażenia', 'slug': 'fakty-czy-wyobrazenia', 'type': 'voice-card-inactive',
                'infoActive': `Prawdopodobnie mylisz fakty z wyobrażeniami. Spróbuj zacząć swoją wypowiedź od słów: Wyobrażam lub ${texts.current_user_gender == 'M' ? 'wyobraziłem' : 'wyobraziłam'} sobie, że…. Zobaczysz jak bardzo to potrafi uspokoić emocje i przybliżyć Was do zrozumienia siebie.`,
                'infoInactive': `${texts.current_user_gender == 'M' ? 'Jej' : 'Jego'} zadaniem jest rozpoczęcie kolejnego zdania od słów: „Wyobrażam sobie, że….”`,
                'info': `Jeżeli czujesz, że ${texts.partner_name} przeinacza fakty i masz potrzebę udowadniania ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'}, że tak nie było.`
            },
            {
                'name': 'Moje emocje', 'slug': 'moje-emocje', 'type': 'hidden',
                'infoActive': `W tym momencie ${texts.partner_name} przeżywa bardzo silne emocje w związku z tym co mówisz. Daj ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'} chwilę na uspokojenie, zastanów się w jaki sposób możesz to łagodniej wyrazić i poczekaj aż odblokuje Kartę Stop`,
                'infoInactive': `Emotka`,
                'info': `Jeżeli czujesz, że nie jesteś w stanie dłużej wytrzymać, Twoje emocje są zbyt silne, naciśnij kartę Stop da Ci to chwilę, żeby ochłonąć.`
            },
            {
                'name': 'Moje emocje', 'slug': 'wybierz-emocje', 'type': 'voice-card-inactive',
                'infoActive': ``,
                'infoInactive': `Emotki`,
                'info': `Jeżeli czujesz, że nie jesteś w stanie dłużej wytrzymać, Twoje emocje są zbyt silne, naciśnij kartę Stop da Ci to chwilę, żeby ochłonąć.`
            },
            {
                'name': 'Stop', 'slug': 'stop', 'type': 'voice-card-inactive',
                'infoActive': `W tym momencie ${texts.partner_name} przeżywa bardzo silne emocje w związku z tym co mówisz. Daj ${texts.partner_user_gender == 'M' ? 'mu' : 'jej'} chwilę na uspokojenie, zastanów się w jaki sposób możesz to łagodniej wyrazić i poczekaj aż odblokuje Kartę Stop`,
                'infoInactive': `Jak będziesz ${texts.current_user_gender == 'M' ? 'gotowy' : 'gotowa'} do dalszej rozmowy odblokuj kartę Stop.`,
                'info': `Jeżeli czujesz, że nie jesteś w stanie dłużej wytrzymać, Twoje emocje są zbyt silne, naciśnij kartę Stop da Ci to chwilę, żeby ochłonąć.`
            },
            {
                'name': 'Komunikacja', 'slug': 'instrukcja', 'type': 'hidden',
                'info': `Komunikacja w związku, a szczególnie rozwiązywanie konfliktów, jest sporym wyzwaniem dla każdej pary. Partnerów rzadko dzieli brak miłości i zaangażowania, to następuje dopiero, gdy stracą do siebie zaufanie, albo wcale. To, co ich dzieli, to nieumiejętność poradzenia sobie z przykrymi emocjami. Umiejętność rozumienia, kontrolowania i wyrażania emocji w budowaniu relacji odgrywa fundamentalne znaczenie. Opracowując Grę Relate, staraliśmy się zawrzeć w niej podstawowe zasady skutecznej komunikacji. Nasze doświadczenie pokazuje, że jeżeli para jest dobrze zmotywowana do pracy i zrozumie, co robić, a czego unikać, to bardzo szybko może zobaczyć pozytywne efekty swojej pracy. <strong>Gra Relate</strong> może być w tym bardzo pomocna.<br>W Grze Relate znajdziecie tzw. Karty Specjalne, to właśnie w nich zawarty jest klucz do sukcesu.`,
            }
        ]

        var specialCardsInfoTexts = [
            {
                'name': 'Zasady komunikacji',
                'slug': 'zasady',
                'info': `Komunikacja w związku, a szczególnie rozwiązywanie konfliktów, jest sporym wyzwaniem dla każdej pary. Partnerów rzadko dzieli brak miłości i zaangażowania, to następuje dopiero, gdy stracą do siebie zaufanie, albo wcale. To, co ich dzieli, to nieumiejętność poradzenia sobie z przykrymi emocjami. Umiejętność rozumienia, kontrolowania i wyrażania emocji w budowaniu relacji odgrywa fundamentalne znaczenie. Opracowując Grę Relate, staraliśmy się zawrzeć w niej podstawowe zasady skutecznej komunikacji. Nasze doświadczenie pokazuje, że jeżeli para jest dobrze zmotywowana do pracy i zrozumie, co robić, a czego unikać, to bardzo szybko może zobaczyć pozytywne efekty swojej pracy. <strong>Gra Relate</strong> może być w tym bardzo pomocna.<br>W Grze Relate znajdziecie tzw. Karty Specjalne, to właśnie w nich zawarty jest klucz do sukcesu.`,
            },
            {
                'name': 'Karta Głosu',
                'slug': 'karta-glosu',
                'info': `Mówi tylko ten, kto ją posiada. Bardzo często podczas rozmowy druga strona przerywa, komentuje, łapie za słowo, zmienia temat. Jest to spowodowane chęcią wyjaśnienia, sprostowania, zaprotestowania. Rozmówcom wydaje się, że brak reakcji jest równoznaczny z przyznaniem się do winy albo oznaką słabości, dlatego trzeba szybko zaprotestować. Jest to najczęściej popełniany błąd podczas trudnych rozmów. Wiele par zaczyna rozmowę od sprawy, ale niestety kolejnym etapem jest kłótnia o przebieg kłótni. W ten sposób nie rozwiązują nieporozumienia, kręcą się w kółko, zwiększając tylko konflikt. Emocje mogą gwałtownie przybierać na sile, ale przy braku możliwości rozładowania, najczęściej będą słabnąć, bo taka jest ich natura. Pojawia się więcej rozsądku, osoba mówiąca ma możliwość dokładnego wyjaśnienia, o co chodzi, nie jest łapana za słówka ani wybijana z toku wypowiedzi. Nazwanie problemu często jest trudne i wymaga czasu, zastanowienia się. Potem, kiedy dostaje się już Kartę Głosu, najczęściej już nie pamięta się tych wszystkich tematów, na które chciało się zareagować, i trochę o to chodzi – zostaje najważniejsze. Efektem stosowania tej zasady będzie: kontrolowanie swoich emocji, poczucie bycia szanowanym, rozumienie siebie.`,
            },
            {
                'name': 'Sprawdzam',
                'slug': 'sprawdzam',
                'info': `Sprawdzam. Zanim powiesz, co o tym myślisz, spróbuj powiedzieć, co usłyszałeś. Przyczyną pojawienia się negatywnych emocji podczas rozmowy nie są słowa partnera tylko nasza interpretacja tych słów. A interpretacja powstaje pod wpływem naszego aktualnego samopoczucia, nastawienia do rozmówcy, a przede wszystkim wcześniejszych doświadczeń. I tutaj pojawiają się poważne bariery. Np. on mówi do niej: „Kup sobie książkę”, a ona słyszy, że jest idiotką; ona mówi do niego: „Posprzątaj w garażu”, a on słyszy, że jest totalnym nierobem i wykrzykuje, że ma już dosyć takiego traktowania; on mówi, że w tamtej sukience było jej lepiej, a ona słyszy, że jest brzydka i już mu się znudziła. Powstrzymanie się od wypowiedzenia swojej opinii i uprzednie upewnienie się, czy dobrze rozumie się wypowiedź partnera, jest kluczowe dla osiągnięcia porozumienia. Dlatego warto razem z Kartą Głosu przekazać kartę Sprawdzam. Efektem zastosowania tej zasady będzie: poczucie bycia rozumianym, brak kłótni, docieranie do sedna sprawy.`,
            },
            {
                'name': 'Tak, ale...',
                'slug': 'tak-ale',
                'info': `Nie zmieniajcie tematu, nie odbijajcie piłeczki, rozmawiajcie o jednej sprawie. Postawa, że najlepszą obroną jest atak, skutecznie wdrażana jest przez używanie słów: „Tak, ale”. Np. ona mówi: „Nigdzie ze mną nie wychodzisz. Kiedy ostatnio gdzieś mnie zaprosiłeś?”. A on odpowiada: „Tak, ale ty ciągle narzekasz, bez przerwy masz pretensje i liczą się dla ciebie tylko dzieci”. Są to dwa różne tematy. W takim dialogu pojawia się licytacja, kto jest bardziej pokrzywdzony i nieszczęśliwy. Trudno oczekiwać porozumienia, skoro obowiązuje zasada: „Skoro ty mi tak robisz, to ja mam prawo zrobić ci podobnie”. Para, której uda się zatrzymać „Tak, ale…”, zaczyna lepiej się słuchać, skupiają się na jednym temacie, pozostaje w nich poczucie bycia rozumianym.`,
            },
            {
                'name': 'Mów o sobie',
                'slug': 'mow-o-sobie',
                'info': `Jest to dosyć trudna karta w zastosowaniu, gdyż wymaga dobrej świadomości swoich uczuć. Generalnie, dobra komunikacja gwarantująca porozumienie charakteryzuje się mówieniem w formie „ja”, bez wydawania opinii o drugiej stronie. Np. zamiast: „Jesteś nieczuły”, pojawia się: „Czuję się opuszczana”, zamiast „Jesteś leniwa”, pojawi się „Czuję się lekceważony”. Taka forma rozmowy eliminuje: ty ciągle, zawsze, nigdy, zmień się, bo ty jesteś. Dla niektórych może to być zaskakujące, bo dotychczas używali tylko takich sformułowań i nie wiedzą, że można inaczej. Karty w grze są tak sformułowane, żeby mówić o swoich uczuciach. Warto je poczytać, gdyż mogą być konkretną podpowiedzią, w jaki sposób wyrażać swoje oczekiwania. Wiele osób po grze stwierdza, że poruszyli bardzo trudny temat i nie pokłócili się, co wcześniej było niemożliwe. Dzięki takim sformułowaniom druga strona nie czuje się zaatakowana, a jedynie skonfrontowana ze swoim zachowaniem lub postawą.`,
            },
            {
                'name': 'Pozwól mi czuć',
                'slug': 'pozwol-mi-czuc',
                'info': `Nic tak nie boli i nie kwestionuje naszej wartości jak wmawianie, że nasze uczucia są złe, że nie powinniśmy tak czuć. Nie ma uczuć dobrych ani złych, są przykre i przyjemne. Wiele osób, zwłaszcza mężczyzn, uznaje emocje swojej partnerki za słabość i stosuje taktykę krytyki za uczucia, mówiąc np.: „Przesadzasz”, „Uspokój się”, „Znowu panikujesz”, „Skąd ty to wymyśliłaś?”. Uznanie czyjegoś prawa do przeżywania na swój sposób danej sprawy jest kluczowym elementem potrzebnym do zbudowania bliskiej relacji. Kwestionowanie uczuć jest kwestionowaniem czyjejś wartości, formą nieakceptacji osoby. Każdy ma swoją wrażliwość, swoje doświadczenia, swój dzień, a cechą emocji jest potrzeba ich wyrażenia, wtedy dopiero ma się do nich więcej dystansu. Ogromnym sukcesem dla pary jest, kiedy oboje pozwalają sobie czuć, zwłaszcza: złość, słabość, smutek, zazdrość, wstyd, lęk, nieporadność, żal. To właśnie z akceptacją tych emocji mamy najczęściej najwięcej problemów. Czucie złości nie oznacza, że jestem złym człowiekiem, a czucie słabości, że jestem słaby. Efektem rozumienia tej zasady będzie: nieudzielanie rad, nieprzerywanie sobie, odróżnienie emocji od postawy.`,
            },
            {
                'name': 'Fakty czy wyobrażenia',
                'slug': 'fakty-wyobrazenia',
                'info': `Odróżnienie faktów od wyobrażeń podczas trudnych rozmów to kolejny milowy krok do szybkiego porozumienia. Zadaniem osoby, która otrzyma taką kartę podczas swojej wypowiedzi, jest rozpoczęcie kolejnego zdania od słów: „Wyobrażam sobie, że…”. Np. po spotkaniu u znajomych ona mówi: „Widziałam, jak flirtowałeś z Magdą”. Faktem było, że z nią rozmawiał, a wyobrażeniem, że z nią flirtował. Gdyby powiedziała: „Jak rozmawiałeś z Magdą, to wyobraziłam sobie, że z nią flirtujesz”, uniknęłaby oskarżenia i dała mu przestrzeń na wyjaśnienie bez oceniania. A gdyby jeszcze dodała: „Jak widzę ładne dziewczyny, to jestem zazdrosna” albo „Boję się, że mnie opuścisz”, to prawdopodobnie dostałaby zapewnienie, że jest najpiękniejszą kobietą na świecie. Efektem zastosowania tej karty będzie: przejście z poziomu oskarżenia na poziom rozumienia siebie, swoich potrzeb i emocji, uniknięcie kłótni, poczucie ulgi, zmiana perspektywy.`,
            },
            {
                'name': 'Moje emocje',
                'slug': 'moje-emocje',
                'info': `Umiejętność uświadomienia sobie, nazwania i właściwego wyrażenia emocji podczas rozmowy to prawdziwy klucz do sukcesu. Kontakt z emocjami przede wszystkim zależy od naszych rodzin pochodzenia. Jeżeli mogliśmy jako dzieci swobodnie je wyrażać i nie byliśmy za nie karani, oceniani, wyśmiewani, to mieliśmy duże szczęście. W wielu rodzinach funkcjonują tzw. mapy emocjonalne, na których znajdują się martwe pola. Pewnych emocji nie wolno było czuć, wyrażać, bo było się za to karanym obrażaniem się, wzbudzaniem poczucia winy, krzykiem, odrzuceniem. Dziecko na swoich etapach rozwoju czuje wszystko: radość smutek, złość, fascynację, słabość, strach, wstyd, niepewność, dumę. Jeżeli nie dostaliśmy możliwości wyrażania tych uczuć w dzieciństwie, to musimy to nadrabiać w życiu dorosłym, bo trudno być w bliskiej relacji bez akceptacji swoich i czyiś emocji. Karta Moje emocje daje możliwość nazywania uczuć podczas rozmowy, takich jak: radość, miłość, smutek, przykrość, złość, niepewność, lęk. Efektem jej stosowania będzie: budowanie atmosfery akceptacji siebie nawzajem, osłabienie nasilenia emocji, możliwość zrozumienia siebie.`,
            },
            {
                'name': 'Stop',
                'slug': 'stop',
                'info': `Czasami podczas rozmowy pojawiają się tak silne emocje, że trudno jest kontynuować dalej bez wywołania kłótni. Dla emocji charakterystyczne jest, że mogą gwałtownie wzrosnąć, osiągając swoje apogeum, ale potem opadają. Mówi się, że czysty gniew trwa 15 sekund. Będąc na szczycie intensywności emocji, trudno nam złapać dystans, dać sobie czas na ich nazwanie, przejście i osłabienie. Karta Stop ma pomóc w przeczekaniu trudnych i intensywnych emocji, żeby móc wrócić do rozmowy. Jeżeli czujesz, że trudno Ci dalej słuchać, możesz na chwilę zatrzymać rozmowę, żeby ochłonąć. Kontynuowanie jej w tym stanie nasili konflikt. Najczęściej do najsilniejszych negatywnych emocji należy złość i przykrość. Efektem zastosowania tej karty będzie: nazwanie swoich emocji, oswojenie się z dyskomfortem, którego dostarczają, uniknięcie kłótni lub przerwania dialogu. Stosowanie karty nie może prowadzić do blokowania emocji, ma pomóc przeczekać ich nasilenie.`,
            },
            {
                'name': 'Ważna uwaga',
                'slug': 'wazna-uwaga',
                'info': `Wiele osób oczekuje prostej recepty i szybkich efektów naprawy relacji w związku. Zniechęcają się, nie widząc poprawy. Wyznacznikiem sukcesu jest determinacja i cierpliwość. Dobrej komunikacji w związku nie można sprowadzić do technik zachowania czy mówienia. Wiedza jest bardzo ważna, stwarza szansę, ale ostatecznie zbudowanie bliskiej relacji jest mocno związane z rozumieniem siebie, zwłaszcza swoich potrzeb, intencji oraz umiejętnością nazywania, przeżywania i wyrażania emocji. Dlatego powyższych zasad może nie uda się Wam wprowadzić w życie od razu, ale dzięki Grze Relate będziecie mogli nabrać wprawy w przeprowadzaniu konstruktywnych rozmów. W przypadku braku postępów może okazać się, że potrzebujecie profesjonalnej pomocy, jaką jest psychoterapia, która daje możliwość głębszego rozumienia siebie i odblokowania emocji.<br><br>Życzymy cierpliwości, zrozumienia i bliskości.
                <br>Agnieszka i Jakub Kołodziejowie – autorzy Gry Relate
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
            gameTitle.innerHTML = 'Wybierz tematykę do rozmowy'
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
            gameTitleDesc.innerHTML = `Wybierz 3 karty, które najbardziej pasują do Twoich oczekiwań i będziesz chciał o nich porozmawiać.<br />Możesz zaznaczyć więcej kart, na końcu dokonasz ostatecznego wyboru`
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
            gameTitleDesc.innerHTML = 'Ułóż karty w kolejności od najmniej ważnej do najważniejszej'
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

            gameTitle.innerHTML = 'Zaczynamy 😊<br/><small>Pozytywy</small>'
            gameTitleDesc.innerHTML = `Wybierz 2 karty, na których będzie to co chcesz ${texts.partner_user_gender == "M" ? 'jemu' : 'jej'} <strong>miłego powiedzieć</strong>.<br />Możesz zaznaczyć więcej kart, a na końcu dokonać ostatecznego wyboru.`
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
            gameTitleDesc.innerHTML = 'Ułóż Karty w kolejności od najmniej ważnej do najważniejszej'
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

            gameTitle.innerHTML = 'Karta Głosu'
            gameTitleDesc.innerHTML = `Posiadanie <strong>Karty Głosu</strong> będzie oznaczać, że masz <strong>prawo mówienia</strong>. ${texts.partner_name} nie będzie mogłą w tym czasie odzywać się, dopowiadać ani komentować. Za złamanie tej zasady poniesie ustalone konsekwencje.`
            // gameTitleDesc.innerHTML = `Przedyskutuj, ustal i wpisz konsekwencje, jeśli ${texts.partner_name}  złamie zasady Karty Głosu`
            gameContent.innerHTML = `Wpisz konsekwencje, jakie ${texts.partner_name} poniesie za złamanie zasady Karty Głosu:`

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
            // gameTitleDesc.innerHTML = 'Z takimi ustawieniami rozpoczniesz nową grę'
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

            sumContent += '<span class="badge badge-pill badge-warning mb-2 mt-4">Konsekwencje za złamanie zasady Karty Głosu</span>'

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

            nextBtn.innerHTML = 'Rozpocznij Grę'

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
                waitingText.innerHTML = `Czekamy, aż ${texts.partner_name} rozpocznie grę<br />${texts.spinner}`
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
            // gameTable.innerHTML = `<h3>Czekamy, aż ${texts.partner_name} rozpocznie grę</h3><p></p>`
            // gameTable.innerHTML = `${texts.spinner}`

            gameContent.appendChild(gameTable)
            // showCardsNav()


        }

        function showDrawPlayer() {

            // specialCardsWrap = document.createElement('div')
            // specialCardsWrap.classList = 'draw-player'

            drawPlayerBtn = document.createElement('button')
            drawPlayerBtn.classList = 'btn btn-dark btn-lg voice-card-draw'
            drawPlayerBtn.innerHTML = 'Losuj kartę głosu';

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
            //     currentCardInfo.innerHTML = 'Przeczytaj na głos:';
            // } else 

            if (currentCard.mine) {
                if (currentCard.positive) {
                    currentCardInfo.innerHTML = `Twój pozytyw ${currentCard.key + 1} z 2`;
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
                    currentCardInfo2.innerHTML = 'W razie potrzeby dopowiedz komentarz do swojego pozytywu<br />lub<br />przekaż Kartę Głosu.';
                } else {
                    currentCardInfo2.innerHTML = `Możesz mówić. ${texts.partner_name} nie może Ci przerywać. <br />Kiedy skończysz, przekaż Kartę Głosu.`;
                }
            } else {
                currentCardInfo2.innerHTML = `${texts.partner_name} mówi, wysłuchaj ${texts.partner_user_gender == 'M' ? 'go' : 'ją'} i poczekaj na Kartę Głosu`;
            }
            gameTable.appendChild(currentCardInfo2);
        }



        function showVoiceCard() {
            if (voiceCard) voiceCard.remove()
            const wrapper_class = 'voice-card'

            voiceCard = document.createElement('div')
            voiceCard.classList = 'mt-auto ' + wrapper_class

            voiceCardActiveToggle()

            voiceCard.innerHTML = 'Karta głosu';
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

                voiceCardBtn.innerHTML = currentCard.positive ? `Przekaż kartę głosu<br /> + <br />pokaż następną kartę` : 'Przekaż kartę głosu'
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

            specialCardsTitle.innerHTML = 'Możesz również skorzystać z Kart Specjalnych:';
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
            dismissPopup.innerHTML = `Nie pokazuj więcej`



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

                bodyText = `Gra polega na <strong>wspólnej rozmowie</strong> na temat wybranych kart. Karty będą wyświetlać się naprzemiennie. Do dyspozycji będziecie mieli tzw. <strong>Karty Specjalne</strong>, które pomogą Wam w zastosowaniu prawidłowych reguł komunikacji. <br />Życzymy powodzenia!`
                startPopup.querySelector('.modal-body').innerHTML = bodyText;
            }

            startPopup.querySelector('.modal-footer').appendChild(dismissStartGamePopup)



            startPopup.querySelector('.modal-title').innerHTML = `Rozpoczynamy Grę Relate`;

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
                bodyText = `${texts.current_user_gender == 'M' ? 'Wylosowałeś' : 'Wylosowałaś'} Kartę Głosu, więc Grę rozpoczynamy od Twojej karty.`
            } else {
                bodyText = `${texts.partner_name} ${texts.partner_user_gender == 'M' ? 'wylosował' : 'wylosowała'} Kartę Głosu, więc Grę rozpoczynamy od ${texts.partner_user_gender == 'M' ? 'jego' : 'jej'} karty.`
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

                    // let modalBody = '<h2>Kiedy używać<br />Kart Specjalnych?</h2>'
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
                    specialCardPopup.querySelector('.modal-footer .waiting-info').innerHTML = `Poczekaj aż ${texts.partner_name} zareaguje. <br />${texts.spinner}`;
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

            cardsNav.innerHTML = '<p class="cards-info mb-1">Jeśli temat został wyczerpany, odsłoń kolejną kartę.</p>';
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

            nextCardBtn.innerHTML = 'Następna karta';

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

            gameTitle.innerHTML = 'Gra zakończona'
            gameTitleDesc.classList.add('d-none')
            gameContent.innerHTML = "<h3>Gratulacje!</h3>Zakończyliście pozytywnie Grę Relate. Życzymy powodzenia w wypełnianiu postanowień i czekamy na kolejną rozgrywkę!"

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
            gameTitleDesc.innerHTML = `Wpisz postanowienie związane z tematem przeprowadzonej rozmowy. Ma to być <strong>konkret</strong>, który zrobisz w najbliższym czasie <strong>dla ${texts.partner_user_gender == 'M' ? 'niego' : 'niej'}</strong> lub dla Waszego związku`
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

            nextBtn.innerHTML = 'Zakończ grę'
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
                gameTopInfo.innerHTML = `Mówisz`

            } else {
                gameTopUser.classList.remove('has-voice-card')
                gameTopPartner.classList.add('has-voice-card')

                gameTopInfo.classList.remove('has-voice-card')
                gameTopInfo.innerHTML = `Słuchasz`

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
            voiceCardBreak = 'Testowa konsekwencja za złamanie zasady Karty Głosu'
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
        alert('Przeglądarka nie jest kompatybilna z Grą Relate')
    }
}