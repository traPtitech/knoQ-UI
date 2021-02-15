declare namespace API {
  namespace Rooms {
    namespace Get {
      export interface Params {
        dateBegin?: string
        dateEnd?: string
      }
      namespace Responses {
        export type $200 = Schemas.Room[]
      }
    }

    namespace Post {
      export interface RequestBody {
        place: string
        timeStart: string
        timeEnd: string
      }
      namespace Responses {
        export type $201 = Schemas.Room
      }
    }

    namespace $RoomId {
      namespace Get {
        namespace Responses {
          export type $200 = Schemas.Room
        }
      }
    }

    namespace Private {
      namespace Post {
        export interface RequestBody {
          place: string
          timeStart: string
          timeEnd: string
        }
        namespace Responses {
          export type $201 = Schemas.Room
        }
      }
    }

    namespace All {
      namespace Post {
        namespace Responses {
          export type $201 = Schemas.Room[]
        }
      }
    }
  }

  namespace Events {
    namespace Get {
      export interface Params {
        dateBegin?: string
        dateEnd?: string
      }
      namespace Responses {
        export type $200 = Schemas.Event[]
      }
    }

    namespace Post {
      export type RequestBody = {
        name: string
        description: string
        sharedRoom: boolean
        timeStart: string
        timeEnd: string
        groupId: string
        admins: string[]
        tags: {
          name: string
        }[]
      } & ({ roomId: string } | { place: string })
      namespace Responses {
        export type $201 = Schemas.Event
      }
    }

    namespace $EventId {
      namespace Get {
        namespace Responses {
          export type $200 = Schemas.Event
        }
      }

      namespace Put {
        export type RequestBody = {
          name: string
          description: string
          sharedRoom: boolean
          timeStart: string
          timeEnd: string
          groupId: string
          admins: string[]
          tags: {
            name: string
          }[]
        } & ({ roomId: string } | { place: string })
        namespace Responses {
          export type $200 = Schemas.Event
        }
      }

      namespace Tags {
        namespace Post {
          export interface RequestBody {
            name: string
          }
          namespace Responses {
            export type $200 = Schemas.Event
          }
        }
      }
    }
  }

  namespace Groups {
    namespace Get {
      namespace Responses {
        export type $200 = Schemas.Group[]
      }
    }

    namespace Post {
      export interface RequestBody {
        name: string
        description: string
        open: boolean
        members: string[]
      }
      namespace Responses {
        export type $201 = Schemas.Group
      }
    }

    namespace $GroupId {
      namespace Get {
        namespace Responses {
          export type $200 = Schemas.Group
        }
      }

      namespace Put {
        export interface RequestBody {
          name: string
          description: string
          open: boolean
          members: string[]
        }
        namespace Responses {
          export type $200 = Schemas.Group
        }
      }

      namespace Events {
        namespace Get {
          namespace Resposes {
            export type $200 = Schemas.Event[]
          }
        }
      }

      namespace Members {
        namespace Me {
          namespace Put {
            namespace Responses {
              export type $200 = Schemas.Group
            }
          }
        }
      }
    }
  }

  namespace Users {
    namespace Get {
      namespace Responses {
        export type $200 = Schemas.User[]
      }
    }
    namespace Me {
      namespace Get {
        namespace Responses {
          export type $200 = Schemas.User
        }
      }
      namespace Events {
        namespace Get {
          namespace Responses {
            export type $200 = Schemas.Event[]
          }
        }
      }

      namespace Groups {
        namespace Get {
          namespace Responses {
            export type $200 = string[]
          }
        }
      }

      namespace Ical {
        namespace Get {
          namespace Responses {
            export type $200 = Schemas.IcalSecret
          }
        }
      }
    }
  }

  namespace Tags {
    namespace Get {
      namespace Responses {
        export type $200 = Schemas.Tag[]
      }
    }
  }

  namespace AuthParams {
    namespace Post {
      namespace Response {
        export type $200 = Schemas.AuthParams
      }
    }
  }
}
