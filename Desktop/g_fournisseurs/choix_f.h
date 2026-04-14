#ifndef CHOIX_F_H
#define CHOIX_F_H

#include <QDialog>

namespace Ui {
class choix_f;
}

class choix_f : public QDialog
{
    Q_OBJECT

public:
    explicit choix_f(QWidget *parent = nullptr);
    ~choix_f();

private:
    Ui::choix_f *ui;
};

#endif // CHOIX_F_H
