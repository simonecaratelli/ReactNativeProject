# Documentazione Progetto: Italian Meals App

Applicazione mobile sviluppata in **React Native** con **Expo** e **TypeScript** per la consultazione e la gestione di ricette della tradizione culinaria italiana. L'applicazione si integra in tempo reale con il servizio REST esterno *TheMealDB*, offrendo un'interfaccia fluida per esplorare i piatti, gestire una lista di preferiti e consultare le modalità di preparazione dettagliate.

---

## 🧭 Cosa mostra la soluzione (Architettura dei Moduli)

### 1. Punto d'Ingresso e Flusso di Avvio (`App.tsx`)
Il modulo principale gestisce l'inizializzazione dello stato dell'applicazione. All'avvio, esegue un controllo sullo storage del dispositivo per verificare se esiste già una sessione utente attiva. In caso positivo, l'applicazione effettua l'accesso automatico reindirizzando l'utente direttamente alla schermata principale, evitando la schermata di login e ottimizzando i tempi di attesa.

### 2. Consumo delle Risorse di Rete (`mealsApi.ts`)
La logica di rete è suddivisa per ottimizzare il trasferimento dei dati tramite l'utilizzo di due endpoint differenti:
* **Fase di Elenco:** Recupera esclusivamente le informazioni essenziali di tutti i piatti italiani (ID, nome e miniatura). Questo permette di caricare la lista principale in modo istantaneo e leggero.
* **Fase di Dettaglio:** Effettua una seconda richiesta mirata solo quando l'utente seleziona un piatto specifico, scaricando i dati estesi come la categoria, l'area geografica, le istruzioni e i componenti della ricetta.

### 3. Strutturazione Dinamica dei Dati (`DetailsScreen.tsx`)
La schermata di dettaglio elabora la struttura dati nativa del database esterno. Poiché le informazioni sugli ingredienti e sulle rispettive dosi vengono restituite disaccoppiate in chiavi numerate singole, l'applicazione implementa un algoritmo di scansione che unisce automaticamente ogni ingrediente alla propria quantità, ripulendo i testi dagli spazi vuoti e generando una lista lineare pronta per la lettura.

### 4. Interfaccia di Autenticazione (`LoginForm.tsx`)
Il modulo gestisce l'accesso controllando i campi di testo in tempo reale. Prima di inoltrare la richiesta, i dati inseriti vengono normalizzati (rimuovendo gli spazi superflui e ignorando la distinzione tra maiuscole e minuscole per l'email). Se le credenziali non corrispondono agli utenti abilitati nel sistema, viene mostrato un messaggio d'errore dinamico senza ricaricare la pagina.

---

## 🛠️ Logiche e Funzionalità Core

### Gestione dello Stato Globale dei Preferiti
Per fare in modo che l'aggiunta o la rimozione di un piatto dai preferiti sia visibile istantaneamente in tutta l'applicazione (sia nella lista principale che nelle singole schede), l'app centralizza questo stato. Qualsiasi componente può verificare se un piatto è salvato o modificarne lo stato al tocco, aggiornando l'interfaccia in modo reattivo.

### Salvataggio Locale dei Dati
L'applicazione mantiene le informazioni memorizzate nel dispositivo anche dopo la chiusura completa del software. Gestisce in modo asincrono due tipi di informazioni:
* **I preferiti:** Salvati come elenco di codici identificativi dei piatti.
* **La sessione:** Mantiene il profilo dell'utente loggato. Al momento del logout, questa informazione viene eliminata per garantire la sicurezza del profilo.

### Tolleranza ai Guasti Multimediali
L'interfaccia è progettata per essere resiliente in caso di problemi di rete o immagini non raggiungibili. Se l'immagine del profilo utente non si carica correttamente, il sistema intercetta l'errore e la sostituisce automaticamente con un cerchio grafico contenente l'iniziale del nome, evitando spazi vuoti o elementi grafici spezzati.

### Supporto ai Collegamenti Diretti (Deep Linking)
L'applicazione è configurata per rispondere a indirizzi web personalizzati del tipo `italianmeals://`. Se il sistema operativo del dispositivo intercetta un link esterno compatibile, l'applicazione si apre automaticamente e reindirizza l'utente in modo diretto alla schermata di dettaglio del piatto richiesto, estraendo l'ID dal collegamento.

### Ottimizzazione Visiva e Adattamento al Tema
Il software supporta la modalità chiara e scura (Light/Dark Mode). Per evitare rallentamenti grafici, i fogli di stile vengono elaborati e memorizzati nella memoria cache del telefono, venendo ricalcolati esclusivamente quando l'utente cambia esplicitamente il tema visivo. Tutti i testi sensibili sono configurati per non subire distorsioni di layout nel caso in cui l'utente utilizzi font di sistema ingranditi nelle impostazioni del telefono.