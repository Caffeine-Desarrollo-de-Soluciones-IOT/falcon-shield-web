

export default {
  en: {
    myDevices: {
      title: 'My Devices',
      subtitle: 'Add or manage your devices',
      registerDevice: 'Register a device',
      searchPlaceholder: 'Search...',
      table: {
        deviceName: 'Device Name',
        image: 'Image',
        brand: 'Brand',
        model: 'Model',
        type: 'Type',
        registeredAt: 'Registered At',
        actions: 'Actions',
        noDevices: 'No devices found',
        loading: 'Loading devices data. Please wait...',
      },
      dialogs: {
        register: {
          title: 'Register a new device',
          step1: 'Select the device type',
          step2: 'Enter the registration code',
          step3: 'Assign to a property & area',
          labels: {
            device: 'Device',
            registrationCode: 'Registration Code',
            property: 'Select a Property',
            area: 'Select an Area',
          },
          placeholders: {
            selectDevice: 'Select a Device',
            loadingDeviceCatalog: 'Loading device catalog...',
            selectProperty: 'Select a Property',
            selectArea: 'Select an Area',
            loadingAreas: 'Loading areas...',
          },
          errors: {
            requiredDevice: 'Choose a device',
            requiredRegistrationCode: 'Registration Code is required',
          },
          buttons: {
            next: 'Next',
            back: 'Back',
            cancel: 'Cancel',
            register: 'Register',
            registering: 'Registering...',
          },
        },
        delete: {
          title: 'Confirm',
          message: 'Are you sure you want to unregister {deviceName}?',
          buttons: {
            no: 'No',
            yes: 'Yes',
            unregistering: 'Unregistering...',
          },
        },
      },
      notifications: {
        success: {
          registered: 'Device registered',
          unregistered: 'Device unregistered',
        },
        error: {
          fetchCatalog: 'Error fetching device catalog',
          fetchDevices: 'Error fetching registered devices',
          fetchProperties: 'Error fetching user properties',
          fetchAreas: 'Error fetching areas',
          register: 'Error registering device',
          unregister: 'Error unregistering device',
        },
      },
    },
  },
  es: {
    myDevices: {
      title: 'Mis Dispositivos',
      subtitle: 'Agrega o administra tus dispositivos',
      registerDevice: 'Registrar un dispositivo',
      searchPlaceholder: 'Buscar...',
      table: {
        deviceName: 'Nombre del dispositivo',
        image: 'Imagen',
        brand: 'Marca',
        model: 'Modelo',
        type: 'Tipo',
        registeredAt: 'Registrado el',
        actions: 'Acciones',
        noDevices: 'No se encontraron dispositivos',
        loading: 'Cargando datos de dispositivos. Por favor, espera...',
      },
      dialogs: {
        register: {
          title: 'Registrar un nuevo dispositivo',
          step1: 'Selecciona el tipo de dispositivo',
          step2: 'Ingresa el código de registro',
          step3: 'Asigna a una propiedad y área',
          labels: {
            device: 'Dispositivo',
            registrationCode: 'Código de Registro',
            property: 'Selecciona una Propiedad',
            area: 'Selecciona un Área',
          },
          placeholders: {
            selectDevice: 'Selecciona un Dispositivo',
            loadingDeviceCatalog: 'Cargando catálogo de dispositivos...',
            selectProperty: 'Selecciona una Propiedad',
            selectArea: 'Selecciona un Área',
            loadingAreas: 'Cargando áreas...',
          },
          errors: {
            requiredDevice: 'Elige un dispositivo',
            requiredRegistrationCode: 'El Código de Registro es obligatorio',
          },
          buttons: {
            next: 'Siguiente',
            back: 'Atrás',
            cancel: 'Cancelar',
            register: 'Registrar',
            registering: 'Registrando...',
          },
        },
        delete: {
          title: 'Confirmar',
          message: '¿Estás seguro de que deseas desregistrar {deviceName}?',
          buttons: {
            no: 'No',
            yes: 'Sí',
            unregistering: 'Desregistrando...',
          },
        },
      },
      notifications: {
        success: {
          registered: 'Dispositivo registrado',
          unregistered: 'Dispositivo desregistrado',
        },
        error: {
          fetchCatalog: 'Error al obtener el catálogo de dispositivos',
          fetchDevices: 'Error al obtener los dispositivos registrados',
          fetchProperties: 'Error al obtener las propiedades del usuario',
          fetchAreas: 'Error al obtener las áreas',
          register: 'Error al registrar el dispositivo',
          unregister: 'Error al desregistrar el dispositivo',
        },
      },
    },
  },
  fr: {
    myDevices: {
      title: 'Mes appareils',
      subtitle: 'Ajoutez ou gérez vos appareils',
      registerDevice: 'Enregistrer un appareil',
      searchPlaceholder: 'Rechercher...',
      table: {
        deviceName: "Nom de l'appareil",
        image: 'Image',
        brand: 'Marque',
        model: 'Modèle',
        type: 'Type',
        registeredAt: 'Enregistré le',
        actions: 'Actions',
        noDevices: 'Aucun appareil trouvé',
        loading: 'Chargement des données des appareils. Veuillez patienter...',
      },
      dialogs: {
        register: {
          title: 'Enregistrer un nouvel appareil',
          step1: "Sélectionnez le type d'appareil",
          step2: 'Entrez le code de registre',
          step3: 'Assignez à une propriété et une zone',
          labels: {
            device: 'Appareil',
            registrationCode: 'Code de registre',
            property: 'Sélectionnez une propriété',
            area: 'Sélectionnez une zone',
          },
          placeholders: {
            selectDevice: 'Sélectionnez un appareil',
            loadingDeviceCatalog: 'Chargement du catalogue des appareils...',
            selectProperty: 'Sélectionnez une propriété',
            selectArea: 'Sélectionnez une zone',
            loadingAreas: 'Chargement des zones...',
          },
          errors: {
            requiredDevice: 'Choisissez un appareil',
            requiredRegistrationCode: 'Le code de registre est obligatoire',
          },
          buttons: {
            next: 'Suivant',
            back: 'Retour',
            cancel: 'Annuler',
            register: 'Enregistrer',
            registering: 'Enregistrement...',
          },
        },
        delete: {
          title: 'Confirmer',
          message: 'Êtes-vous sûr de vouloir désenregistrer {deviceName}?',
          buttons: {
            no: 'Non',
            yes: 'Oui',
            unregistering: 'Désenregistrement...',
          },
        },
      },
      notifications: {
        success: {
          registered: 'Appareil enregistré',
          unregistered: 'Appareil désenregistré',
        },
        error: {
          fetchCatalog: "Erreur lors de la récupération du catalogue d'appareils",
          fetchDevices: 'Erreur lors de la récupération des appareils enregistrés',
          fetchProperties: "Erreur lors de la récupération des propriétés de l'utilisateur",
          fetchAreas: 'Erreur lors de la récupération des zones',
          register: "Erreur lors de l'enregistrement de l'appareil",
          unregister: "Erreur lors de la désinscription de l'appareil",
        },
      },
    },
  },
};
