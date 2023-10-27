package db

type DBRepository interface {
	Increment() (int, error)
	Count() (int, error)
}
