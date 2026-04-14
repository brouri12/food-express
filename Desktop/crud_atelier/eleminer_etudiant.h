#ifndef ELEMINER_ETUDIANT_H
#define ELEMINER_ETUDIANT_H

#include <QDialog>

namespace Ui {
class eleminer_etudiant;
}

class eleminer_etudiant : public QDialog
{
    Q_OBJECT

public:
    explicit eleminer_etudiant(QWidget *parent = nullptr);
    ~eleminer_etudiant();

private:
    Ui::eleminer_etudiant *ui;
};

#endif // ELEMINER_ETUDIANT_H
