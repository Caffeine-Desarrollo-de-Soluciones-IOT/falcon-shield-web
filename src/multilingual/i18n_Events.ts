export default {
  es: {
    events: {
      title: "Eventos de Dispositivos",
      description: "Revisa los eventos de tus dispositivos",
      exportCSV: "Exportar a .csv",
      selectProperty: "Seleccionar una propiedad",
      search: "Buscar...",
      table: {
        emptyMessage: "No se encontraron eventos",
        loadingMessage: "Cargando datos de eventos. Por favor espera...",
        paginatorReport: "Mostrando {first} a {last} de {totalRecords} eventos",
        rowsPerPageOptions: [5, 10, 25],
        columns: {
          title: "Título",
          description: "Descripción",
          type: "Tipo",
          timestamp: "Marca de tiempo"
        },
        statusLabels: {
          ONLINE: "Activo",
          ALERT: "Alerta",
          OFFLINE: "Inactivo",
          ERROR: "Error",
          WARNING: "Advertencia"
        }
      },
      toast: {
        errorFetchingEvents: "Error al obtener los eventos",
        errorFetchingProperties: "Error al obtener las propiedades del usuario"
      }
    }
  },
  en: {
    events: {
      title: "Device Events",
      description: "Review the events of your devices",
      exportCSV: "Export to .csv",
      selectProperty: "Select a Property",
      search: "Search...",
      table: {
        emptyMessage: "No events found",
        loadingMessage: "Loading events data. Please wait...",
        paginatorReport: "Showing {first} to {last} of {totalRecords} events",
        rowsPerPageOptions: [5, 10, 25],
        columns: {
          title: "Title",
          description: "Description",
          type: "Type",
          timestamp: "Timestamp"
        },
        statusLabels: {
          ONLINE: "Active",
          ALERT: "Alert",
          OFFLINE: "Inactive",
          ERROR: "Error",
          WARNING: "Warning"
        }
      },
      toast: {
        errorFetchingEvents: "Error fetching events",
        errorFetchingProperties: "Error fetching user properties"
      }
    }
  },
  fr: {
    events: {
      title: "Événements des Appareils",
      description: "Revoir les événements de vos appareils",
      exportCSV: "Exporter vers .csv",
      selectProperty: "Sélectionner une Propriété",
      search: "Rechercher...",
      table: {
        emptyMessage: "Aucun événement trouvé",
        loadingMessage: "Chargement des données des événements. Veuillez patienter...",
        paginatorReport: "Affichage de {first} à {last} sur {totalRecords} événements",
        rowsPerPageOptions: [5, 10, 25],
        columns: {
          title: "Titre",
          description: "Description",
          type: "Type",
          timestamp: "Horodatage"
        },
        statusLabels: {
          ONLINE: "Actif",
          ALERT: "Alerte",
          OFFLINE: "Inactif",
          ERROR: "Erreur",
          WARNING: "Avertissement"
        }
      },
      toast: {
        errorFetchingEvents: "Erreur lors de la récupération des événements",
        errorFetchingProperties: "Erreur lors de la récupération des propriétés de l'utilisateur"
      }
    }
  }
}
