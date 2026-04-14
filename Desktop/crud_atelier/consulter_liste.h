#ifndef CONSULTER_LISTE_H
#define CONSULTER_LISTE_H

#include <QDialog>

namespace Ui {
class consulter_liste;
}

class consulter_liste : public QDialog
{
    Q_OBJECT

public:
    explicit consulter_liste(QWidget *parent = nullptr);
    ~consulter_liste();

private:
    Ui::consulter_liste *ui;
};

#endif // CONSULTER_LISTE_H
